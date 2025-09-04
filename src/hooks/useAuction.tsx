import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Auction {
  id: string;
  title: string;
  description: string | null;
  starting_price: number;
  current_price: number;
  image_url: string | null;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    username: string;
  } | null;
}

export const useAuction = (auctionId: string) => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const { data, error } = await supabase
          .from('auctions')
          .select('*')
          .eq('id', auctionId)
          .single();

        if (error) throw error;
        setAuction(data);
      } catch (error) {
        console.error('Error fetching auction:', error);
        toast({
          title: "Error",
          description: "Failed to load auction data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId, toast]);

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data, error } = await supabase
          .from('bids')
          .select('*')
          .eq('auction_id', auctionId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBids(data || []);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    if (auctionId) {
      fetchBids();
    }
  }, [auctionId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!auctionId) return;

    // Subscribe to auction updates
    const auctionChannel = supabase
      .channel('auction-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${auctionId}`
        },
        (payload) => {
          setAuction(payload.new as Auction);
        }
      )
      .subscribe();

    // Subscribe to new bids
    const bidsChannel = supabase
      .channel('bid-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`
        },
        async (payload) => {
          // Add new bid to list
          setBids(prevBids => [payload.new as Bid, ...prevBids]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(auctionChannel);
      supabase.removeChannel(bidsChannel);
    };
  }, [auctionId]);

  return {
    auction,
    bids,
    loading,
  };
};

export const usePlaceBid = () => {
  const { toast } = useToast();

  const placeBid = async (auctionId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          auction_id: auctionId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: amount
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bid placed successfully!",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to place bid",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return { placeBid };
};