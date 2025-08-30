/**
 * AUCTION PAGE COMPONENT
 * ======================
 * 
 * This is the main auction page where users can:
 * 1. View product details and images
 * 2. Place bids on items
 * 3. Buy additional bid credits
 * 4. Enable/disable autobidder
 * 5. View recent bidders
 * 
 * PENNY AUCTION MECHANICS:
 * - Each bid costs 0.60₾ and increases the item price by 0.01₾
 * - Timer resets to 10 seconds after each bid
 * - Last bidder when timer hits 0 wins the item
 * - Timer automatically extends forever for testing purposes
 */

import React, { useState, useEffect } from 'react';

// UI Component Imports
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Icon Imports
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Zap,
  Bot
} from 'lucide-react';

// Asset Imports - Samsung Galaxy S25 Ultra Images
import galaxyMainImage from '@/assets/samsung-galaxy-s25-ultra.jpg';
import galaxyBackImage from '@/assets/samsung-galaxy-s25-ultra-back.jpg';
import galaxySideImage from '@/assets/samsung-galaxy-s25-ultra-side.jpg';
import galaxySPenImage from '@/assets/samsung-galaxy-s25-ultra-spen.jpg';

// Component Imports
import Header from '@/components/Header';
import { AviatorAuction } from '@/components/AviatorAuction';
import StreamChat from '@/components/StreamChat';

const Auction = () => {
  // HEADER VISIBILITY STATE
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  /* ================================
   * STATE MANAGEMENT
   * ================================ */

  // AUCTION CORE STATE
  const [currentPrice, setCurrentPrice] = useState(0.01); // Starting price (1 cent)
  const [userBidCredits, setUserBidCredits] = useState(45); // User's remaining bids
  const [timeLeft, setTimeLeft] = useState(10); // Countdown timer in seconds
  const [totalBidsPlaced, setTotalBidsPlaced] = useState(847); // Total bids on this item
  const [lastBidder, setLastBidder] = useState('vako12'); // Current highest bidder

  // UI STATE
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Product image carousel
  const [isLiked, setIsLiked] = useState(false); // Heart/favorite status
  const [showBuyBidsSheet, setShowBuyBidsSheet] = useState(false); // Bid purchase modal

  // BID PROGRESS ANIMATION STATE
  const [bidProgress, setBidProgress] = useState(0); // Progress bar fill percentage (0-100)
  const [userJustBid, setUserJustBid] = useState(false); // Tracks if user just placed a bid

  // AUTOBIDDER STATE
  const [autoBidderEnabled, setAutoBidderEnabled] = useState(false); // Auto-bidding toggle
  
  // AUCTION ENDED STATE (temporary for testing)
  const isAuctionEnded = false; // Set to false to resume bidding

  // TOAST NOTIFICATIONS
  const { toast } = useToast();

  /* ================================
   * CONSTANTS & CONFIGURATION
   * ================================ */

  const BID_COST = 0.60; // Cost per bid in Georgian Lari (₾)
  const PRICE_INCREMENT = 0.01; // Item price increase per bid (1 cent)
  const TIME_EXTENSION = 10; // Seconds added when bid is placed

  // Pool of dummy bidder names for automated bids
  const dummyBidders = [
    'nika23', 'data77', 'mari_ge', 'luka2024', 'ana_k', 'saba99', 'nino_t', 'giorgi_m',
    'keti15', 'temo88', 'sophie_g', 'alex_tbilisi', 'maka_cute', 'oto_king', 'nata_geo'
  ];

  // Product image array for carousel
  const productImages = [
    galaxyMainImage,
    galaxyBackImage, 
    galaxySideImage,
    galaxySPenImage
  ];

  /* ================================
   * HELPER FUNCTIONS
   * ================================ */

  /**
   * Generates realistic bid history with timestamps
   * Creates fake historical bids to populate the recent bidders list
   */
  const generateBidHistory = (totalBids) => {
    const history = [];
    const usedNames = new Set();
    const now = new Date();
    
    // Generate up to 10 historical bids
    for (let i = 0; i < Math.min(10, totalBids); i++) {
      // Select unique bidder name
      let bidderName;
      do {
        bidderName = dummyBidders[Math.floor(Math.random() * dummyBidders.length)];
      } while (usedNames.has(bidderName) && usedNames.size < dummyBidders.length);
      
      usedNames.add(bidderName);
      
      // Generate realistic timestamps going backwards
      const secondsAgo = i === 0 ? 2 :
                        i === 1 ? 18 :
                        i === 2 ? 35 :
                        i === 3 ? 52 :
                        Math.floor(Math.random() * 300) + 60; // 1-5 minutes ago
      
      const bidTime = new Date(now.getTime() - (secondsAgo * 1000));
      const timeString = bidTime.toLocaleTimeString('en-GB', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      history.push({
        id: totalBids - i,
        name: bidderName,
        bidNumber: totalBids - i,
        time: timeString,
        avatar: '/placeholder.svg'
      });
    }
    
    return history;
  };

  // Initialize recent bidders with generated history
  const [recentBidders, setRecentBidders] = useState(() => generateBidHistory(totalBidsPlaced));

  /* ================================
   * SCROLL HANDLER FOR HEADER VISIBILITY
   * ================================ */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or at top
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  /* ================================
   * EFFECT HOOKS
   * ================================ */

  /**
   * AUTOBIDDER FUNCTIONALITY
   * Automatically places bids when enabled and conditions are met
   */
  useEffect(() => {
    if (!autoBidderEnabled || isAuctionEnded) return;
    
    const autoBidInterval = setInterval(() => {
      // Only bid if time is low (last 3 seconds) and user has credits
      if (timeLeft > 0 && timeLeft <= 3 && userBidCredits > 0) {
        handleBid();
      }
    }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds
    
    return () => clearInterval(autoBidInterval);
  }, [autoBidderEnabled, timeLeft, userBidCredits]);

  /**
   * DUMMY BIDDER SYSTEM
   * Creates AI competitors that bid in the final seconds
   */
  useEffect(() => {
    if (timeLeft <= 0 || isAuctionEnded) return;

    // Balanced bot bidding - 75% chance for good activity without being too aggressive
    const shouldBid = Math.random() < 0.75;
    const minTimeForBid = 1; // Don't bid if less than 1 second left
    
    // Only bid in the final 2-4 seconds to create tension (back to original range)
    if (shouldBid && timeLeft > minTimeForBid && timeLeft <= 4) {
      const timer = setTimeout(() => {
        // Double-check timer is still valid before bidding
        if (timeLeft > minTimeForBid) {
          // Select random bidder from pool
          const randomBidder = dummyBidders[Math.floor(Math.random() * dummyBidders.length)];
          
          console.log(`Dummy bidder ${randomBidder} placing bid at ${timeLeft} seconds left`);
          
          // Execute the automated bid
          setCurrentPrice(prev => prev + PRICE_INCREMENT);
          setTotalBidsPlaced(prev => {
            const newTotal = prev + 1;
            
            // Add to bid history with current timestamp
            setRecentBidders(prevBidders => {
              const now = new Date();
              const timeString = now.toLocaleTimeString('en-GB', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              });
              
              const newBidder = {
                id: newTotal,
                name: randomBidder,
                bidNumber: newTotal,
                time: timeString,
                avatar: '/placeholder.svg'
              };
              
              // Keep only latest 10 bidders
              return [newBidder, ...prevBidders.slice(0, 9)];
            });
            
            return newTotal;
          });
          
          // Reset timer and update game state
          setTimeLeft(TIME_EXTENSION);
          setLastBidder(randomBidder);
          
          // Reset user bid progress when someone else bids
          setBidProgress(0);
          setUserJustBid(false);
        }
      }, Math.random() * 1200 + 400); // Slightly longer delay: 0.4-1.6 seconds
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAuctionEnded]);

  /**
   * COUNTDOWN TIMER
   * Modified for testing - automatically extends when reaching 1 second
   */
  useEffect(() => {
    if (timeLeft > 0 && !isAuctionEnded) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          // FOR TESTING: Auto-extend timer to prevent crashes
          if (newTime <= 1) {
            return TIME_EXTENSION; // Reset to full time
          }
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  /**
   * BID PROGRESS ANIMATION
   * Fills the progress bar gradually when user places a bid
   */
  useEffect(() => {
    if (userJustBid && bidProgress < 100) {
      const progressTimer = setTimeout(() => {
        setBidProgress(prev => {
          const increment = 100 / TIME_EXTENSION; // Fill over countdown duration
          return Math.min(prev + increment, 100);
        });
      }, 1000);
      return () => clearTimeout(progressTimer);
    }
  }, [userJustBid, bidProgress]);

  /* ================================
   * EVENT HANDLERS
   * ================================ */

  /**
   * MAIN BID HANDLER
   * Processes user bid placement with validation and state updates
   */
  const handleBid = () => {
    // Validation: Check if auction has ended
    if (isAuctionEnded) {
      toast({
        title: "აუქციონი დასრულებულია",
        description: "ვეღარ შეძლებ ბიდის განთავსებას",
        variant: "destructive"
      });
      return;
    }

    // Validation: Check if user has enough credits
    if (userBidCredits <= 0) {
      toast({
        title: "არ გაქვს საკმარისი ბიდები",
        description: "შეიძინე დამატებითი ბიდები გასაგრძელებლად",
        variant: "destructive"
      });
      return;
    }

    // Validation: Check if user is already the highest bidder
    if (lastBidder === 'შენ') {
      toast({
        title: "შენ უკვე ხარ ყველაზე მაღალი ბიდერი",
        description: "დაელოდე სხვების ბიდებს",
        variant: "default"
      });
      return;
    }

    // Validation: Check if auction is still active
    if (timeLeft <= 0) {
      toast({
        title: "აუქციონი დასრულებულია",
        description: "ვეღარ შეძლებ ბიდის განთავსებას",
        variant: "destructive"
      });
      return;
    }

    // Execute the bid
    setCurrentPrice(prev => prev + PRICE_INCREMENT); // Increase item price
    setUserBidCredits(prev => prev - 1); // Deduct bid credit
    setTotalBidsPlaced(prev => prev + 1); // Increment total bids
    setTimeLeft(TIME_EXTENSION); // Reset countdown timer
    setLastBidder('შენ'); // Set user as highest bidder (Russian: "Ты")
    
    // Start progress animation
    setBidProgress(0);
    setUserJustBid(true);

    // Add user's bid to history
    setRecentBidders(prev => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      const newBidder = {
        id: totalBidsPlaced + 1,
        name: 'შენ', // Russian: "Ты"
        bidNumber: totalBidsPlaced + 1,
        time: timeString,
        avatar: '/placeholder.svg'
      };
      
      return [newBidder, ...prev.slice(0, 9)];
    });
  };

  /**
   * IMAGE CAROUSEL HANDLERS
   */
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  /* ================================
   * RENDER COMPONENT
   * ================================ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-16">
      {/* Site Header */}
      <Header />
      
      <div className="container mx-auto p-3 sm:p-4 lg:p-8">
        {/* Main Content Grid - Mobile-first responsive layout */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto lg:grid-cols-2">
          
          {/* LEFT COLUMN - Product Details (Order 2 on mobile, 1 on desktop) */}
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6 mt-16">
            
            {/* Product Image Carousel */}
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-muted/10">
                {/* Main Product Image */}
                <img
                  src={productImages[currentImageIndex]} 
                  alt="Samsung Galaxy S25 Ultra"
                  className="w-full h-full object-cover"
                />
                
                {/* Carousel Navigation Buttons */}
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
                
                {/* Action Buttons (Heart/Share) */}
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
              
              {/* Thumbnail Navigation */}
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

            {/* Product Information */}
            <Card className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Product Title and Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold leading-tight">Samsung S938B Galaxy S25 Ultra</h1>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ტოპ
                  </Badge>
                </div>
                
                {/* Product Specifications Grid */}
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

                {/* Features List */}
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

          {/* RIGHT COLUMN - Bidding Interface (Order 1 on mobile, 2 on desktop) */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            
            {/* Aviator-Style Game Component */}
            <AviatorAuction
              currentPrice={currentPrice}
              timeLeft={timeLeft}
              totalBidsPlaced={totalBidsPlaced}
              lastBidder={lastBidder}
              userBidCredits={userBidCredits}
              userJustBid={userJustBid}
              bidProgress={bidProgress}
              isAuctionEnded={isAuctionEnded}
              onBonusBidCollected={(collectorId: string) => {
                console.log('🔥 BONUS BID CALLBACK CALLED with collectorId:', collectorId);
                console.log('🔥 Current user bid credits before:', userBidCredits);
                
                // Only give bonus bid to the specific collector
                if (collectorId === 'შენ') {
                  console.log('✅ GIVING BONUS BID TO USER (შენ)');
                  setUserBidCredits(prev => {
                    console.log('🔥 User credits changing from', prev, 'to', prev + 1);
                    return prev + 1;
                  });
                } else {
                  console.log('❌ NOT GIVING BONUS TO USER - bot collected:', collectorId);
                  console.log('🔥 User credits should stay the same:', userBidCredits);
                }
              }}
            />

            {/* User's Bid Credits Display */}
            <Card className="p-3 sm:p-4 bg-gradient-to-r from-orange-500/70 to-orange-600/70 border-orange-400/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="font-medium text-sm sm:text-base text-white">შენი ბიდები</span> {/* Your Bids */}
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-white">{userBidCredits}</p>
                  <p className="text-xs text-white/80">დარჩენილი</p> {/* Remaining */}
                </div>
              </div>
            </Card>

            {/* Live Stream Chat - Prominent Position */}
            <StreamChat />

            {/* Autobidder Card */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">ავტო-ბიდერი</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">ავტომატური ბიდების განთავსება</p>
                  </div>
                </div>
                <Switch
                  checked={autoBidderEnabled}
                  onCheckedChange={setAutoBidderEnabled}
                />
              </div>
              {autoBidderEnabled && (
                <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    ავტო-ბიდერი აქტიურია - ბიდი განთავსდება ბოლო 3 წამში
                  </p>
                </div>
              )}
            </Card>

            {/* Recent Bidders List */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                ბოლო ბიდერები {/* Recent Bidders */}
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
                        {/* Online indicator for latest bidder */}
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{bidder.name}</p>
                        <p className="text-xs text-muted-foreground">{bidder.time}</p> {/* Timestamp */}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-xs sm:text-sm">ბიდი #{bidder.bidNumber}</p> {/* Bid # */}
                      {/* Leader badge for top bidder */}
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          წამყვანი {/* Leader */}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sticky Top Bar - Quick Bidding Interface */}
        <div className={`fixed left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/50 p-2 shadow-lg transition-all duration-300 z-40 ${isHeaderVisible ? 'top-16' : 'top-0'}`}>
          <div className="container mx-auto flex items-center gap-3">
            {/* Product Thumbnail */}
            <div className="flex-shrink-0">
              <img 
                src={productImages[currentImageIndex]} 
                alt="Samsung Galaxy S25 Ultra"
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">Samsung S938B Galaxy S25 Ultra</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{currentPrice.toFixed(2)} ₾</span>
                <span>•</span>
                <span>{String(timeLeft).padStart(2, '0')} წამი</span> {/* seconds */}
              </div>
            </div>
            
            {/* Quick Bid Button */}
            <Button 
              onClick={handleBid}
              disabled={userBidCredits <= 0 || timeLeft <= 0}
              size="sm"
              className="bg-green-500 hover:bg-green-400 text-white font-bold px-4"
            >
              ბიდი {/* Bid */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
