import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, TrendingDown, Users, Zap, Activity, ArrowUpRight, ArrowDownRight, LogIn, User } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { AuthModal } from '@/components/AuthModal';
import { GameLeaderboard } from '@/components/GameLeaderboard';
import { JackpotMeter } from '@/components/JackpotMeter';

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { auctions, currentUser, logout, isAuthenticated } = useGameStore();

  // Mock trading pairs data
  const tradingPairs = [
    { pair: 'BTC/USD', price: '67,429.12', change: '+2.34%', volume: '2.4B', isUp: true },
    { pair: 'ETH/USD', price: '3,847.55', change: '+5.67%', volume: '1.8B', isUp: true },
    { pair: 'SOL/USD', price: '198.32', change: '-1.23%', volume: '456M', isUp: false },
    { pair: 'ADA/USD', price: '0.4521', change: '+0.89%', volume: '234M', isUp: true },
    { pair: 'DOT/USD', price: '7.82', change: '-2.15%', volume: '123M', isUp: false },
  ];

  // Convert auctions to trading-style format
  const auctionMarkets = auctions.map(auction => ({
    id: auction.id,
    title: auction.title,
    pair: `${auction.title.split(' ')[0].toUpperCase()}/BTC`,
    currentBid: auction.currentBid,
    highBid: auction.prizePool,
    lowBid: auction.currentBid * 0.8,
    change: '+0.23',
    changePercent: '+10.4%',
    volume: auction.bids.length,
    timeLeft: auction.timeLeft,
    bidders: new Set(auction.bids.map(b => b.userId)).size,
    isUp: true,
    isActive: auction.isActive
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Trading Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-primary">მანეკი Exchange</h1>
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-500 font-medium">Online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">24h Volume:</span>
                  <span className="font-medium">₿ 1,247.82</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{currentUser.username}</div>
                    <div className="text-xs text-muted-foreground">₿ {currentUser.balance.toFixed(3)}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button size="sm" onClick={() => setShowAuthModal(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Price Ticker */}
      <div className="bg-muted/30 border-b overflow-hidden">
        <div className="flex animate-scroll space-x-8 py-2 px-4">
          {[...tradingPairs, ...tradingPairs].map((pair, index) => (
            <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-medium text-sm">{pair.pair}</span>
              <span className="text-sm">${pair.price}</span>
              <span className={`text-xs flex items-center ${pair.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {pair.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {pair.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <JackpotMeter />
            <GameLeaderboard />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Live Auction Markets</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Trading
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {auctionMarkets.filter(a => a.isActive).length} Active
                </Badge>
              </div>
            </div>

            {/* Trading Table */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 gap-4 p-4 bg-muted/30 text-xs font-medium text-muted-foreground border-b">
                  <div>Market</div>
                  <div className="text-right">Current Bid</div>
                  <div className="text-right">Time Left</div>
                  <div className="text-right">Prize Pool</div>
                  <div className="text-right">Min Bid</div>
                  <div className="text-right">Bidders</div>
                  <div className="text-center">Action</div>
                </div>

                {auctionMarkets.map((market) => (
                  <div key={market.id} className="grid grid-cols-7 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{market.pair}</div>
                      <div className="text-xs text-muted-foreground">{market.title}</div>
                      {market.isActive && (
                        <Badge variant="secondary" className="text-xs mt-1">LIVE</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₿ {market.currentBid.toFixed(3)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${market.timeLeft <= 30 ? 'text-red-500 font-bold' : ''}`}>
                        {Math.floor(market.timeLeft / 60)}:{(market.timeLeft % 60).toString().padStart(2, '0')}
                      </div>
                      {market.timeLeft <= 30 && (
                        <Badge variant="destructive" className="text-xs">URGENT</Badge>
                      )}
                    </div>
                    <div className="text-right text-sm font-medium text-green-600">
                      ₿ {market.highBid.toFixed(3)}
                    </div>
                    <div className="text-right text-sm">₿ {market.lowBid.toFixed(3)}</div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{market.bidders}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-end">
                        <Users className="h-3 w-3 mr-1" />
                        bidders
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/auction/${market.id}`)}
                        className="px-6"
                        disabled={!market.isActive}
                      >
                        {market.isActive ? 'Bid Now' : 'View Results'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">
                    ₿ {auctions.reduce((sum, a) => sum + a.prizePool, 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Prize Pools</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {auctions.reduce((sum, a) => sum + new Set(a.bids.map(b => b.userId)).size, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Active Bidders</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {auctionMarkets.filter(a => a.isActive).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Live Auctions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {auctions.reduce((sum, a) => sum + a.bids.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Bids</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;
