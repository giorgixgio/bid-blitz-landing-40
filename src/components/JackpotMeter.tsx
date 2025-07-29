import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Coins } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export const JackpotMeter = () => {
  const { globalJackpot, triggerJackpot, currentUser } = useGameStore();
  
  // Jackpot progress (triggers at 25 BTC)
  const jackpotThreshold = 25.0;
  const progress = Math.min((globalJackpot / jackpotThreshold) * 100, 100);
  
  const handleTriggerJackpot = () => {
    if (!currentUser) return;
    
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500']
    });
    
    toast({
      title: '🎊 JACKPOT WON! 🎊',
      description: `Congratulations! You won ₿ ${globalJackpot.toFixed(3)}!`,
    });
    
    triggerJackpot();
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600">
          <Zap className="h-5 w-5" />
          Global Jackpot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center gap-2">
            <Coins className="h-8 w-8" />
            ₿ {globalJackpot.toFixed(3)}
          </div>
          <p className="text-sm text-muted-foreground">
            Grows with every bid • Random trigger
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to mega jackpot</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {progress >= 100 && (
          <div className="text-center space-y-2">
            <p className="text-sm text-yellow-600 font-medium animate-pulse">
              🔥 Mega Jackpot Ready! 🔥
            </p>
            <Button 
              onClick={handleTriggerJackpot}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              disabled={!currentUser}
            >
              Claim Mega Jackpot!
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs text-center">
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold">10%</div>
            <div className="text-muted-foreground">Trigger Chance</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold">2%</div>
            <div className="text-muted-foreground">Per Bid</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};