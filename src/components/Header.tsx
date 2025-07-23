/**
 * HEADER COMPONENT
 * ================
 * 
 * Site-wide navigation header with:
 * - Brand logo and tagline
 * - Search functionality
 * - User notifications
 * - Bid credits display
 * - Mobile-responsive design
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  User, 
  Menu,
  Heart,
  ShoppingCart
} from 'lucide-react';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsVisible(false);
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand Section */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/68ec0e8e-2e73-40a5-ae5c-1033c2f1169a.png" 
              alt="MANEKI Logo" 
              className="h-8 w-auto"
            />
            {/* Brand tagline - hidden on mobile */}
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">ღირებული ნივთები, უზიარო ფასები</p>
            </div>
          </div>

          {/* Search Bar - Desktop only */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="მოძებნე აუქციონები..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Notifications with Badge */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>

            {/* Favorites - Hidden on mobile */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>

            {/* Bid Credits Display - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-accent to-auction-premium px-3 py-1.5 rounded-full">
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">45</span>
              <span className="text-xs text-white/80">ბიდი</span>
            </div>

            {/* User Profile */}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;