import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  ChevronRight
} from 'lucide-react';

const Auction = () => {
  const [currentBid, setCurrentBid] = useState(3599);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 15 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  // Mock product images
  const productImages = [
    '/placeholder.svg', // Main product image
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  // Mock recent bidders
  const recentBidders = [
    { id: 1, name: 'vako12', amount: 3499, time: '2 წუთის წინ', avatar: '/placeholder.svg' },
    { id: 2, name: 'zukito24', amount: 3450, time: '5 წუთის წინ', avatar: '/placeholder.svg' },
    { id: 3, name: 'rezman777', amount: 3400, time: '8 წუთის წინ', avatar: '/placeholder.svg' },
    { id: 4, name: 'Roma17', amount: 3350, time: '12 წუთის წინ', avatar: '/placeholder.svg' },
  ];

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBid = () => {
    const bid = parseFloat(bidAmount);
    if (!bid || bid <= currentBid) {
      toast({
        title: "არასწორი ბიდი",
        description: `ბიდი უნდა იყოს ${currentBid + 1} ₾-ზე მეტი`,
        variant: "destructive"
      });
      return;
    }

    setCurrentBid(bid);
    setBidAmount('');
    toast({
      title: "ბიდი წარმატებით განთავსდა!",
      description: `თქვენი ბიდი ${bid} ₾ განთავსდა`,
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
            {/* Timer and Current Bid */}
            <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="space-y-4">
                <div className="flex justify-center items-center gap-4">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">მიმდინარე ფასი</p>
                    <p className="text-3xl font-bold text-primary">{currentBid} ₾</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">დარჩენილი დრო</p>
                    <div className="flex gap-1 text-2xl font-bold text-destructive">
                      <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span>:</span>
                      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span>:</span>
                      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>აუქციონი ძალაშია</span>
                </div>
              </div>
            </Card>

            {/* Bid Placement */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  ბიდის განთავსება
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      თქვენი ბიდი (მინ: {currentBid + 1} ₾)
                    </label>
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`${currentBid + 50}`}
                      className="text-lg h-12"
                      min={currentBid + 1}
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {[50, 100, 200, 500].map((increment) => (
                      <Button
                        key={increment}
                        variant="outline"
                        size="sm"
                        onClick={() => setBidAmount(String(currentBid + increment))}
                        className="flex-1 min-w-[80px]"
                      >
                        +{increment} ₾
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleBid}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    disabled={!bidAmount || parseFloat(bidAmount) <= currentBid}
                  >
                    <Gavel className="w-5 h-5 mr-2" />
                    ბიდის განთავსება
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  ბიდის განთავსებით თქვენ ეთანხმებით ჩვენს წესებსა და პირობებს
                </p>
              </div>
            </Card>

            {/* Recent Bidders */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                ბოლო ბიდერები
              </h3>
              
              <div className="space-y-3">
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
                      <p className="font-semibold text-sm">{bidder.amount} ₾</p>
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