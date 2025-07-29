import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, TrendingDown, Users, Zap, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Mock trading pairs data
  const tradingPairs = [
    { pair: 'BTC/USD', price: '67,429.12', change: '+2.34%', volume: '2.4B', isUp: true },
    { pair: 'ETH/USD', price: '3,847.55', change: '+5.67%', volume: '1.8B', isUp: true },
    { pair: 'SOL/USD', price: '198.32', change: '-1.23%', volume: '456M', isUp: false },
    { pair: 'ADA/USD', price: '0.4521', change: '+0.89%', volume: '234M', isUp: true },
    { pair: 'DOT/USD', price: '7.82', change: '-2.15%', volume: '123M', isUp: false },
  ];

  // Mock auction lots with trading-style data
  const auctionLots = [
    {
      id: 383,
      title: 'Samsung Galaxy S25 Ultra',
      pair: 'PHONE/BTC',
      currentBid: 2.45,
      highBid: 2.67,
      lowBid: 2.12,
      change: '+0.23',
      changePercent: '+10.4%',
      volume: 45,
      timeLeft: '2h 15m',
      bidders: 23,
      isUp: true
    },
    {
      id: 384,
      title: 'Bitcoin Mining Hardware',
      pair: 'ASIC/BTC',
      currentBid: 1.8,
      highBid: 1.95,
      lowBid: 1.65,
      change: '-0.05',
      changePercent: '-2.7%',
      volume: 28,
      timeLeft: '4h 32m',
      bidders: 15,
      isUp: false
    },
    {
      id: 385,
      title: 'Crypto Security Vault',
      pair: 'VAULT/BTC',
      currentBid: 0.75,
      highBid: 0.89,
      lowBid: 0.71,
      change: '+0.04',
      changePercent: '+5.6%',
      volume: 12,
      timeLeft: '1h 8m',
      bidders: 8,
      isUp: true
    }
  ];

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
              <Button variant="outline" size="sm">Login</Button>
              <Button size="sm">Register</Button>
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
          {/* Market Overview */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tradingPairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <div className="text-xs text-muted-foreground">{pair.pair}</div>
                    <div className="text-right">
                      <div className="text-xs font-medium">${pair.price}</div>
                      <div className={`text-xs ${pair.isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {pair.change}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Auction Markets */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Auction Markets</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Trading
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {auctionLots.length} Active
                </Badge>
              </div>
            </div>

            {/* Trading Table Header */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 gap-4 p-4 bg-muted/30 text-xs font-medium text-muted-foreground border-b">
                  <div>Market</div>
                  <div className="text-right">Last Price</div>
                  <div className="text-right">24h Change</div>
                  <div className="text-right">24h High</div>
                  <div className="text-right">24h Low</div>
                  <div className="text-right">Volume</div>
                  <div className="text-center">Action</div>
                </div>

                {/* Trading Rows */}
                {auctionLots.map((lot) => (
                  <div key={lot.id} className="grid grid-cols-7 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{lot.pair}</div>
                      <div className="text-xs text-muted-foreground">{lot.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₿ {lot.currentBid}</div>
                      <div className="text-xs text-muted-foreground">{lot.timeLeft}</div>
                    </div>
                    <div className={`text-right font-medium ${lot.isUp ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center justify-end">
                        {lot.isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {lot.changePercent}
                      </div>
                      <div className="text-xs">{lot.change}</div>
                    </div>
                    <div className="text-right text-sm">₿ {lot.highBid}</div>
                    <div className="text-right text-sm">₿ {lot.lowBid}</div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{lot.volume}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-end">
                        <Users className="h-3 w-3 mr-1" />
                        {lot.bidders}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/auction/${lot.id}`)}
                        className="px-6"
                      >
                        Trade
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
                  <div className="text-2xl font-bold text-green-500">₿ 45.2</div>
                  <div className="text-xs text-muted-foreground">24h Volume</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-xs text-muted-foreground">Active Traders</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">12</div>
                  <div className="text-xs text-muted-foreground">Live Auctions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">98.7%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
