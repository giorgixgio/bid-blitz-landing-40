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

// Import product images
import galaxyMainImage from '@/assets/samsung-galaxy-s25-ultra.jpg';
import galaxyBackImage from '@/assets/samsung-galaxy-s25-ultra-back.jpg';
import galaxySideImage from '@/assets/samsung-galaxy-s25-ultra-side.jpg';
import galaxySPenImage from '@/assets/samsung-galaxy-s25-ultra-spen.jpg';

const Auction = () => {
  const [currentPrice, setCurrentPrice] = useState(0.01); // Penny auction starts at 1 cent
  const [userBidCredits, setUserBidCredits] = useState(45); // User's remaining bids
  const [timeLeft, setTimeLeft] = useState(15); // Seconds left
  const [totalBidsPlaced, setTotalBidsPlaced] = useState(847);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [lastBidder, setLastBidder] = useState('vako12');
  const [showStickyBar, setShowStickyBar] = useState(true);
  const { toast } = useToast();

  const BID_COST = 0.60; // Cost per bid in ₾
  const PRICE_INCREMENT = 0.01; // Each bid increases price by 1 cent
  const TIME_EXTENSION = 15; // Seconds added per bid

  // Product images - Samsung Galaxy S25 Ultra
  const productImages = [
    galaxyMainImage,
    galaxyBackImage, 
    galaxySideImage,
    galaxySPenImage
  ];

  // Mock recent bidders for penny auction
  const recentBidders = [
    { id: 1, name: 'vako12', bidNumber: totalBidsPlaced, time: '2 წამის წინ', avatar: '/placeholder.svg' },
    { id: 2, name: 'zukito24', bidNumber: totalBidsPlaced - 1, time: '18 წამის წინ', avatar: '/placeholder.svg' },
    { id: 3, name: 'rezman777', bidNumber: totalBidsPlaced - 2, time: '35 წამის წინ', avatar: '/placeholder.svg' },
    { id: 4, name: 'Roma17', bidNumber: totalBidsPlaced - 3, time: '52 წამის წინ', avatar: '/placeholder.svg' },
    { id: 5, name: 'jemiko10', bidNumber: totalBidsPlaced - 4, time: '1 წუთის წინ', avatar: '/placeholder.svg' },
  ];

  // Scroll detection for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const productSection = document.getElementById('product-images');
      if (productSection) {
        const rect = productSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowStickyBar(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className="container mx-auto p-3 sm:p-4 lg:p-8">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto lg:grid-cols-2">
          
          {/* Mobile-first: Bidding section comes first on mobile */}
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6">{/* Left Column - Product Details */}
            {/* Product Images - Mobile optimized */}
            <Card id="product-images" className="overflow-hidden">
              <div className="relative aspect-square bg-muted/10">
                <img
                  src={productImages[currentImageIndex]} 
                  alt="Samsung Galaxy S25 Ultra"
                  className="w-full h-full object-cover"
                />
                {/* Mobile-friendly navigation buttons */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background h-10 w-10 sm:h-12 sm:w-12"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background h-10 w-10 sm:h-12 sm:w-12"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                
                {/* Mobile-optimized action buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-background/90 hover:bg-background h-9 w-9 sm:h-10 sm:w-10"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-background/90 hover:bg-background h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Mobile-optimized thumbnail navigation */}
              <div className="p-3 sm:p-4 border-t">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Mobile-optimized Product Info */}
            <Card className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold leading-tight">Samsung S938B Galaxy S25 Ultra</h1>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ტოპ
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">საცალო ფასი:</span> 3599 ₾
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

                <div className="pt-3 sm:pt-4 border-t">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">მახასიათებლები</h3>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <li>• 256GB მეხსიერება</li>
                    <li>• 12GB RAM</li>
                    <li>• 200MP კამერა</li>
                    <li>• S Pen-ით</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile-first: Bidding section (appears first on mobile) */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            {/* Mobile-optimized Timer and Current Price */}
            <Card className="p-4 sm:p-6 text-center bg-gradient-to-r from-primary to-destructive border-primary/20 shadow-lg">
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-white/80">მიმდინარე ფასი</p>
                  <p className="text-3xl sm:text-4xl font-bold text-white">{currentPrice.toFixed(2)} ₾</p>
                  <p className="text-xs text-white/80">საცალო ფასი: 3599 ₾</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-white/80">დარჩენილი დრო</p>
                  <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 5 ? 'text-warning animate-pulse' : 'text-white'}`}>
                    {String(timeLeft).padStart(2, '0')} წამი
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-white/80">
                    <Gavel className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{totalBidsPlaced} ბიდი</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/80">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>წამყვანი: {lastBidder}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mobile-optimized User Bid Credits */}
            <Card className="p-3 sm:p-4 bg-gradient-to-r from-accent to-auction-premium border-accent/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="font-medium text-sm sm:text-base text-white">შენი ბიდები</span>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-white">{userBidCredits}</p>
                  <p className="text-xs text-white/80">დარჩენილი</p>
                </div>
              </div>
            </Card>

            {/* Mobile-optimized Bid Placement */}
            <Card className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold">ბიდის განთავსება</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    ყოველი ბიდი: <span className="font-bold text-primary">{BID_COST} ₾</span> | 
                    ფასი იზრდება: <span className="font-bold text-primary">+{PRICE_INCREMENT.toFixed(2)} ₾</span>
                  </p>
                </div>
                
                {/* Extra large mobile-friendly BID button */}
                <Button 
                  onClick={handleBid}
                  className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90 disabled:from-muted disabled:to-muted shadow-lg text-white transform transition-transform active:scale-95"
                  disabled={userBidCredits <= 0 || timeLeft <= 0}
                >
                  {timeLeft <= 0 ? (
                    "აუქციონი დასრულდა"
                  ) : userBidCredits <= 0 ? (
                    "არ გაქვს ბიდები"
                  ) : (
                    <>
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      ბიდი ({BID_COST} ₾)
                    </>
                  )}
                </Button>

                {userBidCredits <= 5 && userBidCredits > 0 && (
                  <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-xs sm:text-sm text-destructive font-medium">
                      ⚠️ მალე ბიდები დამთავრდება! შეიძინე ახალი ბიდები
                    </p>
                  </div>
                )}

                <Button variant="outline" className="w-full h-12 text-sm sm:text-base">
                  <Coins className="w-4 h-4 mr-2" />
                  ბიდების შეძენა
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  ტაიმერი განახლდება ყოველი ბიდის შემდეგ {TIME_EXTENSION} წამით
                </p>
              </div>
            </Card>

            {/* Mobile-optimized Recent Bidders */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                ბოლო ბიდერები
              </h3>
              
              <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
                {recentBidders.map((bidder, index) => (
                  <div key={bidder.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative">
                        <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                          <AvatarImage src={bidder.avatar} />
                          <AvatarFallback className="text-xs">{bidder.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{bidder.name}</p>
                        <p className="text-xs text-muted-foreground">{bidder.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-xs sm:text-sm">ბიდი #{bidder.bidNumber}</p>
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

        {/* Sticky Bottom Bar */}
        <div className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-3 shadow-lg transition-transform duration-300 z-50 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="container mx-auto flex items-center gap-3">
            <div className="flex-shrink-0">
              <img 
                src={productImages[currentImageIndex]} 
                alt="Samsung Galaxy S25 Ultra"
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">Samsung S938B Galaxy S25 Ultra</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-primary">{currentPrice.toFixed(2)} ₾</span>
                <span>•</span>
                <span>{String(timeLeft).padStart(2, '0')} წამი</span>
              </div>
            </div>
            <Button 
              onClick={handleBid}
              disabled={userBidCredits <= 0 || timeLeft <= 0}
              size="sm"
              className="bg-gradient-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90 text-white font-bold px-4"
            >
              ბიდი
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;