import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { LiveAuction } from '@/components/LiveAuction';
import { AuctionResults } from '@/components/AuctionResults';
import { GameLeaderboard } from '@/components/GameLeaderboard';
import { JackpotMeter } from '@/components/JackpotMeter';

const Auction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auctions, auctionHistory } = useGameStore();
  
  const auction = auctions.find(a => a.id === id) || auctionHistory.find(a => a.id === id);
  
  if (!auction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exchange
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exchange
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {auction.isEnded ? <AuctionResults auction={auction} /> : <LiveAuction auction={auction} />}
          </div>
          <div className="lg:col-span-1 space-y-6">
            <JackpotMeter />
            <GameLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;