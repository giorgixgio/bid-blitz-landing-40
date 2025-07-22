import React from 'react';
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
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/68ec0e8e-2e73-40a5-ae5c-1033c2f1169a.png" 
              alt="MANEKI Logo" 
              className="h-8 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">ღირებული ნივთები, უზიარო ფასები</p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
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
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>

            {/* Bid Credits */}
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