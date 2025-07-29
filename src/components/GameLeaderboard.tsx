import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Coins } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

export const GameLeaderboard = () => {
  const { leaderboard, currentUser } = useGameStore();

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-600" />;
      default: return <Coins className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboard.slice(0, 10).map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              currentUser?.id === user.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Badge variant={getPositionBadge(index + 1)} className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                {index + 1}
              </Badge>
              {getPositionIcon(index + 1)}
              <div>
                <div className="font-medium flex items-center gap-2">
                  {user.username}
                  {currentUser?.id === user.id && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.auctionsWon} wins • {user.totalBids} bids
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">
                ₿ {user.totalWinnings.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">
                Balance: ₿ {user.balance.toFixed(3)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};