import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Zap, TrendingUp, Trophy, Coins, DollarSign } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import type { Auction } from '@/hooks/useGameStore';

interface LiveAuctionProps {
  auction: Auction;
}

export const LiveAuction = ({ auction }: LiveAuctionProps) => {
  const { currentUser, placeBid, updateAuctionTimer, buyBidCredits } = useGameStore();
  const [creditsToBuy, setCreditsToBuy] = useState('');
  
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

    if (currentUser.bidCredits < 1) {
      toast({ 
        title: 'No bid credits', 
        description: 'You need bid credits to place bids. Buy some below!',
        variant: 'destructive'
      });
      return;
    }

    if (placeBid(auction.id)) {
      const newPrice = auction.currentBid + auction.bidIncrement;
      toast({ 
        title: 'Bid placed!', 
        description: `Price increased to ₿ ${newPrice.toFixed(3)}. Cost: 1 bid credit ($0.25)` 
      });
      
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
        description: 'Insufficient bid credits or auction ended',
        variant: 'destructive'
      });
    }
  };

  const handleBuyCredits = () => {
    if (!currentUser) return;
    
    const amount = parseInt(creditsToBuy);
    if (isNaN(amount) || amount < 1) {
      toast({ 
        title: 'Invalid amount', 
        description: 'Please enter a valid number of credits to buy',
        variant: 'destructive'
      });
      return;
    }

    if (buyBidCredits(amount)) {
      toast({ 
        title: 'Credits purchased!', 
        description: `${amount} bid credits purchased for $${(amount * 0.5).toFixed(2)}` 
      });
      setCreditsToBuy('');
    } else {
      toast({ 
        title: 'Purchase failed', 
        description: 'Insufficient balance',
        variant: 'destructive'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeProgress = auction.timeLeft > 0 ? (auction.timeLeft / 300) * 100 : 0;
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

        {/* Penny Auction Info */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-yellow-800 dark:text-yellow-200">Penny Auction Rules</span>
          </div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <p>• Each bid costs 1 credit ($0.25) and increases price by ₿ {auction.bidIncrement.toFixed(3)}</p>
            <p>• Timer extends by 10 seconds with each bid</p>
            <p>• Winner pays final price + gets prize pool minus their bid costs</p>
          </div>
        </div>

        {/* Current Bid Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold text-primary">₿ {auction.currentBid.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground">Next: ₿ {(auction.currentBid + auction.bidIncrement).toFixed(3)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Prize Pool</p>
            <p className="text-2xl font-bold text-green-600">₿ {auction.prizePool.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground">From bid fees</p>
          </div>
        </div>

        {/* Last Bidder */}
        {lastBidder && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              <strong>{lastBidder.username}</strong> leads at ₿ {lastBidder.amount.toFixed(3)}
            </span>
          </div>
        )}

        {/* User Bid Credits */}
        {currentUser && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Your Bid Credits: {currentUser.bidCredits}</span>
                </div>
                <p className="text-xs text-muted-foreground">Balance: ${currentUser.balance.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Spent on bids</p>
                <p className="font-semibold">${currentUser.totalSpentOnBids.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bidding Section */}
        {auction.isActive && (
          <div className="space-y-3">
            <Button 
              onClick={handlePlaceBid}
              disabled={!currentUser || (currentUser && currentUser.bidCredits < 1)}
              className="w-full h-12 text-lg font-bold"
              size="lg"
            >
              {!currentUser ? 'Login to Bid' : 
               currentUser.bidCredits < 1 ? 'No Bid Credits' :
               `Bid Now (1 Credit = $0.25)`}
            </Button>
            
            {!currentUser && (
              <p className="text-sm text-muted-foreground text-center">
                Login to participate in auctions
              </p>
            )}
          </div>
        )}

        {/* Buy Credits Section */}
        {currentUser && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Buy Bid Credits ($0.50 each)
            </h4>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={creditsToBuy}
                onChange={(e) => setCreditsToBuy(e.target.value)}
                placeholder="Amount"
                className="flex-1"
              />
              <Button 
                onClick={handleBuyCredits}
                disabled={!creditsToBuy || parseInt(creditsToBuy) < 1}
                variant="outline"
              >
                Buy ${(parseInt(creditsToBuy) * 0.5 || 0).toFixed(2)}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setCreditsToBuy('10')}>
                10 Credits ($5)
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCreditsToBuy('25')}>
                25 Credits ($12.50)
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCreditsToBuy('50')}>
                50 Credits ($25)
              </Button>
            </div>
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
            <div className="font-semibold">${(auction.bids.length * 0.25).toFixed(2)}</div>
            <div className="text-muted-foreground">Revenue</div>
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
                  <div className="text-right">
                    <div>₿ {bid.amount.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">-$0.25</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};