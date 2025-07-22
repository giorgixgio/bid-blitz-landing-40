import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import Header from '@/components/Header';
import { AviatorAuction } from '@/components/AviatorAuction';

const Auction = () => {
  const [currentPrice, setCurrentPrice] = useState(0.01); // Penny auction starts at 1 cent
  const [userBidCredits, setUserBidCredits] = useState(45); // User's remaining bids
  const [timeLeft, setTimeLeft] = useState(10); // Seconds left
  const [totalBidsPlaced, setTotalBidsPlaced] = useState(847);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [lastBidder, setLastBidder] = useState('vako12');
  const [showStickyBar, setShowStickyBar] = useState(true);
  const [bidProgress, setBidProgress] = useState(0); // Progress bar for user bid
  const [userJustBid, setUserJustBid] = useState(false); // Track if user just placed a bid
  const [showBuyBidsSheet, setShowBuyBidsSheet] = useState(false); // Control buy bids sheet
  const { toast } = useToast();

  const BID_COST = 0.60; // Cost per bid in ₾
  const PRICE_INCREMENT = 0.01; // Each bid increases price by 1 cent
  const TIME_EXTENSION = 10; // Seconds added per bid

  // Dummy bidders pool
  const dummyBidders = [
    'nika23', 'data77', 'mari_ge', 'luka2024', 'ana_k', 'saba99', 'nino_t', 'giorgi_m',
    'keti15', 'temo88', 'sophie_g', 'alex_tbilisi', 'maka_cute', 'oto_king', 'nata_geo'
  ];

  // Product images - Samsung Galaxy S25 Ultra
  const productImages = [
    galaxyMainImage,
    galaxyBackImage, 
    galaxySideImage,
    galaxySPenImage
  ];

  // Generate initial bidders history
  const generateBidHistory = (totalBids) => {
    const history = [];
    const usedNames = new Set();
    
    for (let i = 0; i < Math.min(10, totalBids); i++) {
      let bidderName;
      do {
        bidderName = dummyBidders[Math.floor(Math.random() * dummyBidders.length)];
      } while (usedNames.has(bidderName) && usedNames.size < dummyBidders.length);
      
      usedNames.add(bidderName);
      
      const timeAgo = i === 0 ? '2 წამის წინ' : 
                     i === 1 ? '18 წამის წინ' :
                     i === 2 ? '35 წამის წინ' :
                     i === 3 ? '52 წამის წინ' :
                     `${Math.floor(Math.random() * 5) + 1} წუთის წინ`;
      
      history.push({
        id: totalBids - i,
        name: bidderName,
        bidNumber: totalBids - i,
        time: timeAgo,
        avatar: '/placeholder.svg'
      });
    }
    
    return history;
  };

  const [recentBidders, setRecentBidders] = useState(() => generateBidHistory(totalBidsPlaced));

  // Automatic bidding system
  useEffect(() => {
    if (timeLeft <= 0) return;

    const shouldBid = Math.random() < 0.7; // 70% chance to bid each second in final moments
    const minTimeForBid = 1; // Don't bid if less than 1 second left
    
    if (shouldBid && timeLeft > minTimeForBid && timeLeft <= 4) { // Only bid in last 2-4 seconds
      const timer = setTimeout(() => {
        // Select random bidder
        const randomBidder = dummyBidders[Math.floor(Math.random() * dummyBidders.length)];
        
        console.log(`Dummy bidder ${randomBidder} placing bid at ${timeLeft} seconds left`);
        
        // Place automated bid
        setCurrentPrice(prev => prev + PRICE_INCREMENT);
        setTotalBidsPlaced(prev => {
          const newTotal = prev + 1;
          
          // Update bid history
          setRecentBidders(prevBidders => {
            const newBidder = {
              id: newTotal,
              name: randomBidder,
              bidNumber: newTotal,
              time: 'ახლა',
              avatar: '/placeholder.svg'
            };
            
            const updated = [newBidder, ...prevBidders.slice(0, 9)];
            // Update timestamps
            return updated.map((bidder, index) => ({
              ...bidder,
              time: index === 0 ? 'ახლა' :
                    index === 1 ? '15 წამის წინ' :
                    index === 2 ? '30 წამის წინ' :
                    `${index * 15} წამის წინ`
            }));
          });
          
          return newTotal;
        });
        setTimeLeft(TIME_EXTENSION);
        setLastBidder(randomBidder);
        
        // Reset user bid progress when someone else bids
        setBidProgress(0);
        setUserJustBid(false);
        
      }, Math.random() * 1000 + 500); // Random delay between 0.5-1.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft]); // Only depend on timeLeft

  // Sticky bar always visible
  useEffect(() => {
    setShowStickyBar(true); // Always show sticky bar
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

  // Bid progress effect - fills up over time when user bids
  useEffect(() => {
    if (userJustBid && bidProgress < 100) {
      const progressTimer = setTimeout(() => {
        setBidProgress(prev => {
          const increment = 100 / TIME_EXTENSION; // Fill over the countdown duration
          return Math.min(prev + increment, 100);
        });
      }, 1000);
      return () => clearTimeout(progressTimer);
    }
  }, [userJustBid, bidProgress]);

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

    // Place user bid
    setCurrentPrice(prev => prev + PRICE_INCREMENT);
    setUserBidCredits(prev => prev - 1);
    setTotalBidsPlaced(prev => prev + 1);
    setTimeLeft(TIME_EXTENSION); // Reset timer
    setLastBidder('შენ'); // You are now the highest bidder
    
    // Start bid progress animation
    setBidProgress(0);
    setUserJustBid(true);

    // Update bid history with user bid
    setRecentBidders(prev => {
      const newBidder = {
        id: totalBidsPlaced + 1,
        name: 'შენ',
        bidNumber: totalBidsPlaced + 1,
        time: 'ახლა',
        avatar: '/placeholder.svg'
      };
      
      const updated = [newBidder, ...prev.slice(0, 9)];
      return updated.map((bidder, index) => ({
        ...bidder,
        time: index === 0 ? 'ახლა' :
              index === 1 ? '15 წამის წინ' :
              index === 2 ? '30 წამის წინ' :
              `${index * 15} წამის წინ`
      }));
    });

    // Removed toast notification for smoother UX
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <div className="container mx-auto p-3 sm:p-4 lg:p-8">
        {/* Add top padding when sticky bar is visible */}
        <div className={`transition-all duration-300 ${showStickyBar ? 'pt-16' : 'pt-0'}`}>
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
            {/* Aviator Style Game */}
            <AviatorAuction
              currentPrice={currentPrice}
              timeLeft={timeLeft}
              totalBidsPlaced={totalBidsPlaced}
              lastBidder={lastBidder}
              userBidCredits={userBidCredits}
              userJustBid={userJustBid}
              bidProgress={bidProgress}
            />

            {/* Mobile-optimized User Bid Credits */}
            <Card className="p-3 sm:p-4 bg-gradient-to-r from-orange-500/70 to-orange-600/70 border-orange-400/20 shadow-lg">
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
                
                {/* Extra large mobile-friendly BID button with progress */}
                <div className="relative">
                  <Button 
                    onClick={handleBid}
                    className={`w-full h-14 sm:h-16 text-lg sm:text-xl font-bold shadow-lg text-white transform transition-transform active:scale-95 relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-muted disabled:to-muted`}
                    disabled={userBidCredits <= 0 || timeLeft <= 0}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {timeLeft <= 0 ? (
                        "აუქციონი დასრულდა"
                      ) : userBidCredits <= 0 ? (
                        "არ გაქვს ბიდები"
                      ) : userJustBid ? (
                        "YOU ARE WINNING!"
                      ) : (
                        <>
                          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span>ბიდი ({BID_COST} ₾)</span>
                        </>
                      )}
                    </span>
                  </Button>
                  
                  {/* Progress overlay - filled part has original button colors */}
                  {userJustBid && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md z-0">
                      <div 
                        className="h-full bg-gradient-to-r from-green-300 to-green-400 transition-all duration-1000 ease-linear"
                        style={{ width: `${bidProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {userBidCredits <= 5 && userBidCredits > 0 && (
                  <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-xs sm:text-sm text-destructive font-medium">
                      ⚠️ მალე ბიდები დამთავრდება! შეიძინე ახალი ბიდები
                    </p>
                  </div>
                )}

                <Sheet open={showBuyBidsSheet} onOpenChange={setShowBuyBidsSheet}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full h-12 text-sm sm:text-base border-orange-400/30 hover:bg-orange-500/10">
                      <Coins className="w-4 h-4 mr-2" />
                      ბიდების შეძენა
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl overflow-y-auto">
                    <SheetHeader className="text-center pb-6">
                      <SheetTitle className="text-xl font-bold">ბიდების შეძენა</SheetTitle>
                      <p className="text-muted-foreground">აირჩიე ბიდების პაკეტი და განაგრძე აუქციონი</p>
                    </SheetHeader>

                    <div className="space-y-6 max-w-md mx-auto pb-8">
                      {/* Bid Packages */}
                      <div className="grid gap-3">
                        <div className="p-4 border-2 border-orange-400 bg-orange-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg">50 ბიდი</h3>
                              <p className="text-sm text-muted-foreground">ყველაზე პოპულარული</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-orange-600">30₾</p>
                              <p className="text-xs text-muted-foreground">0.60₾ თითო ბიდი</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold">25 ბიდი</h3>
                              <p className="text-sm text-muted-foreground">დამწყებთათვის</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">16₾</p>
                              <p className="text-xs text-muted-foreground">0.64₾ თითო ბიდი</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold">100 ბიდი</h3>
                              <p className="text-sm text-muted-foreground">ყველაზე ოპტიმალური</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">55₾</p>
                              <p className="text-xs text-muted-foreground">0.55₾ თითო ბიდი</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Form */}
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-4">გადახდის დეტალები</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">ბარათის ნომერი</Label>
                            <Input 
                              id="cardNumber" 
                              placeholder="1234 5678 9012 3456" 
                              defaultValue="4111 1111 1111 1111"
                              className="font-mono"
                              autoFocus={false}
                              readOnly
                              onFocus={(e) => e.target.removeAttribute('readonly')}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">ვადა</Label>
                              <Input 
                                id="expiry" 
                                placeholder="MM/YY" 
                                defaultValue="12/25"
                                className="font-mono"
                                autoFocus={false}
                                readOnly
                                onFocus={(e) => e.target.removeAttribute('readonly')}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input 
                                id="cvv" 
                                placeholder="123" 
                                defaultValue="123"
                                className="font-mono"
                                autoFocus={false}
                                readOnly
                                onFocus={(e) => e.target.removeAttribute('readonly')}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="cardName">ბარათზე მითითებული სახელი</Label>
                            <Input 
                              id="cardName" 
                              placeholder="John Doe" 
                              defaultValue="John Doe"
                              autoFocus={false}
                              readOnly
                              onFocus={(e) => e.target.removeAttribute('readonly')}
                            />
                          </div>

                          <Button 
                            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white"
                            onClick={() => {
                              setUserBidCredits(prev => prev + 50);
                              setShowBuyBidsSheet(false);
                              toast({
                                title: "ბიდები წარმატებით შეძენილია!",
                                description: "50 ბიდი დაემატა თქვენს ანგარიშს",
                              });
                            }}
                          >
                            გადახდა - 30₾
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

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

        {/* Sticky Top Bar - closer to header */}
        <div className={`fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/50 p-2 shadow-lg transition-transform duration-300 z-40 ${
          showStickyBar ? 'translate-y-0' : '-translate-y-full'
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
                <span className="font-bold text-foreground">{currentPrice.toFixed(2)} ₾</span>
                <span>•</span>
                <span>{String(timeLeft).padStart(2, '0')} წამი</span>
              </div>
            </div>
            <Button 
              onClick={handleBid}
              disabled={userBidCredits <= 0 || timeLeft <= 0}
              size="sm"
              className="bg-green-500 hover:bg-green-400 text-white font-bold px-4"
            >
              ბიდი
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;