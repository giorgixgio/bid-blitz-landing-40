import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Gift, Zap } from 'lucide-react';
import type { Auction } from '@/hooks/useGameStore';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface AuctionResultsProps {
  auction: Auction;
}

export const AuctionResults = ({ auction }: AuctionResultsProps) => {
  const results = auction.finalResults;
  if (!results) return null;

  // Trigger confetti when results are shown
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600">
          <Trophy className="h-6 w-6" />
          Auction Results - {auction.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Winner */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="text-xl font-bold text-yellow-600">
                  🎉 {results.winner.user.username}
                </h3>
                <p className="text-sm text-muted-foreground">Winner</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">
                ₿ {results.winner.prize.toFixed(3)}
              </p>
              <Badge variant="secondary" className="mt-1">
                {results.winner.winnerBonus}% bonus
              </Badge>
            </div>
          </div>
        </div>

        {/* Other Positions */}
        <div className="space-y-3">
          {results.second && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Medal className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="font-semibold">{results.second.user.username}</p>
                  <p className="text-sm text-muted-foreground">2nd Place</p>
                </div>
              </div>
              <p className="font-bold text-gray-600">
                ₿ {results.second.prize.toFixed(3)}
              </p>
            </div>
          )}

          {results.third && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-semibold">{results.third.user.username}</p>
                  <p className="text-sm text-muted-foreground">3rd Place</p>
                </div>
              </div>
              <p className="font-bold text-orange-600">
                ₿ {results.third.prize.toFixed(3)}
              </p>
            </div>
          )}
        </div>

        {/* Random Rewards */}
        {results.randomRewards.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Random Rewards
            </h4>
            {results.randomRewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                <span className="text-sm font-medium">{reward.user.username}</span>
                <Badge variant="outline" className="text-green-600 border-green-600/50">
                  ₿ {reward.prize.toFixed(3)}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Jackpot Trigger */}
        {results.jackpotTriggered && results.jackpotWinner && (
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="text-xl font-bold text-purple-600">
                  🎊 JACKPOT TRIGGERED! 🎊
                </h3>
                <p className="text-sm">
                  {results.jackpotWinner.username} won the ₿ {results.jackpotAmount?.toFixed(3)} jackpot!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Auction Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Prize Pool</p>
            <p className="text-lg font-bold">₿ {auction.prizePool.toFixed(3)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Bids</p>
            <p className="text-lg font-bold">{auction.bids.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
