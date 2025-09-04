import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAuction, usePlaceBid } from '@/hooks/useAuction';
import { useBidderProfiles } from '@/hooks/useBidderProfiles';
import { Clock, TrendingUp, Users, Gavel } from 'lucide-react';
import Header from '@/components/Header';
import samsungImage from '@/assets/samsung-galaxy-s25-ultra.jpg';

const AuctionDb = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { auction, bids, loading } = useAuction(id || '');
  const { placeBid } = usePlaceBid();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for demo
  
  // Get user IDs for profile lookup
  const userIds = bids.map(bid => bid.user_id);
  const { getUsernameById } = useBidderProfiles(userIds);

  // Countdown effect
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleBid = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place bids",
        variant: "destructive",
      });
      return;
    }

    if (!auction) return;

    const newBidAmount = auction.current_price + 0.01;
    const result = await placeBid(auction.id, newBidAmount);
    
    if (result.success) {
      // Add bomb animation
      setBombAnimation({ active: true, id: Date.now() });
      setTimeout(() => setBombAnimation({ active: false, id: 0 }), 2000);
      setTimeLeft(10); // Reset timer
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Bomb animation state
  const [bombAnimation, setBombAnimation] = useState({ active: false, id: 0 });

  if (!id) return <Navigate to="/" />;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!auction) return <div className="min-h-screen flex items-center justify-center">Auction not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-16 pb-20 overflow-x-hidden">
      <Header />

      {/* Flying Plane Target */}
      <div className="fixed top-20 right-10 z-30 text-4xl">
        ✈️
      </div>

      {/* Bomb Animation */}
      {bombAnimation.active && (
        <div 
          key={bombAnimation.id}
          className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-40 text-3xl pointer-events-none"
          style={{
            animation: 'bomb-flight 2s ease-out forwards'
          }}
        >
          💣
        </div>
      )}

      <div className="container mx-auto p-4 max-w-7xl">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          
          {/* LEFT COLUMN - Product Details */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted/10">
                <img
                  src={auction.image_url || samsungImage} 
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* Product Info */}
            <Card className="p-6">
              <h1 className="text-2xl font-bold mb-2">{auction.title}</h1>
              <p className="text-muted-foreground mb-4">{auction.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Starting Price</div>
                  <div className="text-lg font-bold">${auction.starting_price}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-2xl font-bold text-primary">${auction.current_price}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - Bidding Interface */}
          <div className="space-y-6">
            
            {/* Auction Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  <Clock className="w-4 h-4 mr-2" />
                  Live Auction
                </Badge>
                <div className="text-2xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">${auction.current_price}</div>
                  <div className="text-sm text-muted-foreground">Current Bid</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{bids.length}</div>
                  <div className="text-sm text-muted-foreground">Total Bids</div>
                </div>
                <div className="text-center">
                  <Gavel className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">${(auction.current_price + 0.01).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Next Bid</div>
                </div>
              </div>

              <Button 
                onClick={handleBid}
                disabled={!user || auction.status !== 'active'}
                size="lg" 
                className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {!user ? 'Sign In to Bid' : `Place Bid - $${(auction.current_price + 0.01).toFixed(2)}`}
              </Button>
            </Card>

            {/* Recent Bidders */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Bidders</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No bids yet. Be the first!</p>
                ) : (
                  bids.map((bid, index) => (
                    <div key={bid.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {getUsernameById(bid.user_id).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {getUsernameById(bid.user_id)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${bid.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(bid.created_at).toLocaleTimeString()}
                      </div>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Leading</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDb;