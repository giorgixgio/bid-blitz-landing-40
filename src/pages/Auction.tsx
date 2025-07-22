import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Gavel, 
  TrendingUp, 
  Users, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Zap
} from 'lucide-react';

const Auction = () => {
  const [currentPrice, setCurrentPrice] = useState(0.01); // Penny auction starts at 1 cent
  const [userBidCredits, setUserBidCredits] = useState(45); // User's remaining bids
  const [timeLeft, setTimeLeft] = useState(15); // Seconds left
  const [totalBidsPlaced, setTotalBidsPlaced] = useState(847);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [lastBidder, setLastBidder] = useState('vako12');
  const { toast } = useToast();

  const BID_COST = 0.60; // Cost per bid in ₾
  const PRICE_INCREMENT = 0.01; // Each bid increases price by 1 cent
  const TIME_EXTENSION = 15; // Seconds added per bid

  // Mock product images
  const productImages = [
    '/placeholder.svg', // Main product image
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  // Mock recent bidders for penny auction
  const recentBidders = [
    { id: 1, name: 'vako12', bidNumber: totalBidsPlaced, time: '2 წამის წინ', avatar: '/placeholder.svg' },
    { id: 2, name: 'zukito24', bidNumber: totalBidsPlaced - 1, time: '18 წამის წინ', avatar: '/placeholder.svg' },
    { id: 3, name: 'rezman777', bidNumber: totalBidsPlaced - 2, time: '35 წამის წინ', avatar: '/placeholder.svg' },
    { id: 4, name: 'Roma17', bidNumber: totalBidsPlaced - 3, time: '52 წამის წინ', avatar: '/placeholder.svg' },
    { id: 5, name: 'jemiko10', bidNumber: totalBidsPlaced - 4, time: '1 წუთის წინ', avatar: '/placeholder.svg' },
  ];

  // Timer countdown effect - resets to TIME_EXTENSION when bid is placed
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleBid = () => {
    if (userBidCredits <= 0) {
      toast({
        title: "არ გაქვს საკმარისი ბიდები",
        description: "შეიძინე დამატებითი ბიდები გასაგრძელებლად",
        variant: "destructive"
      });
      return;
    }

    if (timeLeft <= 0) {
      toast({
        title: "აუქციონი დასრულებულია",
        description: "ვეღარ შეძლებ ბიდის განთავსებას",
        variant: "destructive"
      });
      return;
    }

    // Place bid
    setCurrentPrice(prev => prev + PRICE_INCREMENT);
    setUserBidCredits(prev => prev - 1);
    setTotalBidsPlaced(prev => prev + 1);
    setTimeLeft(TIME_EXTENSION); // Reset timer
    setLastBidder('შენ'); // You are now the highest bidder

    toast({
      title: "ბიდი წარმატებით განთავსდა!",
      description: `ახალი ფასი: ${(currentPrice + PRICE_INCREMENT).toFixed(2)} ₾`,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            {/* Product Images */}
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-muted/10">
                <img 
                  src={productImages[currentImageIndex]} 
                  alt="Samsung Galaxy S25 Ultra"
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Thumbnail navigation */}
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Product Info */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold">Samsung S938B Galaxy S25 Ultra</h1>
                  <Badge variant="secondary" className="ml-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ტოპ აუქციონი
                  </Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">სამყაროს ფასი:</span> 3599 ₾
                  </div>
                  <div>
                    <span className="font-medium">მდგომარეობა:</span> ახალი
                  </div>
                  <div>
                    <span className="font-medium">კატეგორია:</span> სმარტფონები
                  </div>
                  <div>
                    <span className="font-medium">ბრენდი:</span> Samsung
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">მახასიათებლები</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 256GB მეხსიერება</li>
                    <li>• 12GB RAM</li>
                    <li>• 200MP კამერა</li>
                    <li>• S Pen-ით</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Bidding Section */}
          <div className="space-y-6">
            {/* Timer and Current Price */}
            <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">მიმდინარე ფასი</p>
                  <p className="text-4xl font-bold text-primary">{currentPrice.toFixed(2)} ₾</p>
                  <p className="text-xs text-muted-foreground">საცალო ფასი: 3599 ₾</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">დარჩენილი დრო</p>
                  <div className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                    {String(timeLeft).padStart(2, '0')} წამი
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Gavel className="w-4 h-4" />
                    <span>{totalBidsPlaced} ბიდი განთავსდა</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>წამყვანი: {lastBidder}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* User Bid Credits */}
            <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="font-medium">შენი ბიდები</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{userBidCredits}</p>
                  <p className="text-xs text-muted-foreground">დარჩენილი</p>
                </div>
              </div>
            </Card>

            {/* Bid Placement */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">ბიდის განთავსება</h3>
                  <p className="text-sm text-muted-foreground">
                    ყოველი ბიდი: <span className="font-bold text-primary">{BID_COST} ₾</span> | 
                    ფასი იზრდება: <span className="font-bold text-primary">+{PRICE_INCREMENT.toFixed(2)} ₾</span>
                  </p>
                </div>
                
                <Button 
                  onClick={handleBid}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted"
                  disabled={userBidCredits <= 0 || timeLeft <= 0}
                >
                  {timeLeft <= 0 ? (
                    "აუქციონი დასრულდა"
                  ) : userBidCredits <= 0 ? (
                    "არ გაქვს ბიდები"
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-2" />
                      ბიდი ({BID_COST} ₾)
                    </>
                  )}
                </Button>

                {userBidCredits <= 5 && userBidCredits > 0 && (
                  <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ მალე ბიდები დამთავრდება! შეიძინე ახალი ბიდები
                    </p>
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  <Coins className="w-4 h-4 mr-2" />
                  ბიდების შეძენა
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  ტაიმერი განახლდება ყოველი ბიდის შემდეგ {TIME_EXTENSION} წამით
                </p>
              </div>
            </Card>

            {/* Recent Bidders */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                ბოლო ბიდერები
              </h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentBidders.map((bidder, index) => (
                  <div key={bidder.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={bidder.avatar} />
                          <AvatarFallback className="text-xs">{bidder.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bidder.name}</p>
                        <p className="text-xs text-muted-foreground">{bidder.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">ბიდი #{bidder.bidNumber}</p>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          წამყვანი
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;