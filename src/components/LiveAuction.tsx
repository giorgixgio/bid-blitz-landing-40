import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Zap, TrendingUp, Trophy } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import type { Auction } from '@/hooks/useGameStore';

interface LiveAuctionProps {
  auction: Auction;
}

export const LiveAuction = ({ auction }: LiveAuctionProps) => {
  const [bidAmount, setBidAmount] = useState('');
  const { currentUser, placeBid, updateAuctionTimer } = useGameStore();
  
  // Update timer every second
  useEffect(() => {
    if (!auction.isActive) return;
    
    const interval = setInterval(() => {
      updateAuctionTimer(auction.id);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [auction.id, auction.isActive, updateAuctionTimer]);

  const handlePlaceBid = () => {
    if (!currentUser) {
      toast({ title: 'Please login', description: 'You need to login to place bids' });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < auction.currentBid + auction.bidIncrement) {
      toast({ 
        title: 'Invalid bid', 
        description: `Minimum bid: ₿ ${(auction.currentBid + auction.bidIncrement).toFixed(3)}`,
        variant: 'destructive'
      });
      return;
    }

    if (placeBid(auction.id, amount)) {
      toast({ 
        title: 'Bid placed!', 
        description: `₿ ${amount.toFixed(3)} bid placed successfully` 
      });
      setBidAmount('');
      
      // Small confetti for successful bid
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#10B981', '#059669']
      });
    } else {
      toast({ 
        title: 'Bid failed', 
        description: 'Insufficient balance or invalid bid',
        variant: 'destructive'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeProgress = auction.timeLeft > 0 ? (auction.timeLeft / 300) * 100 : 0; // Assuming 5 min max
  const isUrgent = auction.timeLeft <= 30;
  const lastBidder = auction.bids[auction.bids.length - 1];

  return (
    <Card className={`transition-all duration-300 ${isUrgent ? 'ring-2 ring-red-500 animate-pulse' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{auction.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{auction.description}</p>
          </div>
          <Badge 
            variant={auction.isActive ? "default" : "secondary"}
            className={auction.isActive ? "animate-pulse" : ""}
          >
            {auction.isActive ? 'LIVE' : 'ENDED'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Auction Image */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center">
            <Zap className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Timer and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-muted-foreground'}`} />
              <span className={`font-mono text-lg ${isUrgent ? 'text-red-500 font-bold' : ''}`}>
                {formatTime(auction.timeLeft)}
              </span>
            </div>
            {isUrgent && (
              <Badge variant="destructive" className="animate-pulse">
                URGENT!
              </Badge>
            )}
          </div>
          <Progress 
            value={timeProgress} 
            className={`h-2 ${isUrgent ? 'bg-red-100' : ''}`}
          />
        </div>

        {/* Current Bid Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Bid</p>
            <p className="text-2xl font-bold text-primary">₿ {auction.currentBid.toFixed(3)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Prize Pool</p>
            <p className="text-2xl font-bold text-green-600">₿ {auction.prizePool.toFixed(3)}</p>
          </div>
        </div>

        {/* Last Bidder */}
        {lastBidder && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              <strong>{lastBidder.username}</strong> leads with ₿ {lastBidder.amount.toFixed(3)}
            </span>
          </div>
        )}

        {/* Bidding Section */}
        {auction.isActive && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.001"
                min={auction.currentBid + auction.bidIncrement}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min: ₿ ${(auction.currentBid + auction.bidIncrement).toFixed(3)}`}
                disabled={!currentUser}
              />
              <Button 
                onClick={handlePlaceBid}
                disabled={!currentUser || !bidAmount}
                className="min-w-24"
              >
                Bid
              </Button>
            </div>
            
            {!currentUser && (
              <p className="text-sm text-muted-foreground text-center">
                Login to place bids
              </p>
            )}
            
            {currentUser && (
              <p className="text-sm text-muted-foreground text-center">
                Balance: ₿ {currentUser.balance.toFixed(3)}
              </p>
            )}
          </div>
        )}

        {/* Auction Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              {new Set(auction.bids.map(b => b.userId)).size}
            </div>
            <div className="text-muted-foreground">Bidders</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {auction.bids.length}
            </div>
            <div className="text-muted-foreground">Total Bids</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold">₿ {auction.bidIncrement.toFixed(3)}</div>
            <div className="text-muted-foreground">Min Increment</div>
          </div>
        </div>

        {/* Recent Bids */}
        {auction.bids.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recent Bids</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {auction.bids.slice(-5).reverse().map((bid) => (
                <div key={bid.id} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                  <span className="font-medium">{bid.username}</span>
                  <span>₿ {bid.amount.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};