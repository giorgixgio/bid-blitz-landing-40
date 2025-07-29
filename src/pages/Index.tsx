import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, Users, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Mock auction data - we'll make this dynamic later
  const auctionLots = [
    {
      id: 383,
      title: 'Samsung Galaxy S25 Ultra',
      image: '/src/assets/samsung-galaxy-s25-ultra.jpg',
      currentBid: 2.45,
      currency: 'BTC',
      timeLeft: '2h 15m',
      bidders: 23,
      isHot: true
    },
    {
      id: 384,
      title: 'Bitcoin Mining Hardware',
      image: '/src/assets/bitcoin-3d-golden.png',
      currentBid: 1.8,
      currency: 'BTC',
      timeLeft: '4h 32m',
      bidders: 15,
      isHot: false
    },
    {
      id: 385,
      title: 'Crypto Security Vault',
      image: '/src/assets/bitcoin-security.jpg',
      currentBid: 0.75,
      currency: 'BTC',
      timeLeft: '1h 8m',
      bidders: 8,
      isHot: true
    }
  ];

  const marketStats = [
    { label: 'Active Auctions', value: '12', icon: Zap },
    { label: 'Total Bidders', value: '156', icon: Users },
    { label: 'Volume 24h', value: '45.2 BTC', icon: TrendingUp },
    { label: 'Avg. Auction Time', value: '3h 24m', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                მანეკი Exchange
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-500 border-green-500/20">
                ₿ 67,429.12
              </Badge>
              <Badge variant="outline" className="text-orange-500 border-orange-500/20">
                Ξ 3,847.55
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Market Stats */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketStats.map((stat, index) => (
            <Card key={index} className="bg-card/50 hover:bg-card/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Live Auctions</h2>
          <Badge variant="secondary" className="animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            {auctionLots.length} Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionLots.map((lot) => (
            <Card key={lot.id} className="group hover:shadow-lg transition-all duration-300 bg-card/50 hover:bg-card/80">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{lot.title}</CardTitle>
                  {lot.isHot && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      HOT
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image placeholder */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Bid info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Bid</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-primary">
                        {lot.currentBid} {lot.currency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{lot.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{lot.bidders} bidders</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/auction/${lot.id}`)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Place Bid
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>მანეკი Exchange - The Future of Crypto Auctions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
