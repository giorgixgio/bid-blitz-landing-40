import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Gavel, Users, Coins } from 'lucide-react';

interface AviatorAuctionProps {
  currentPrice: number;
  timeLeft: number;
  totalBidsPlaced: number;
  lastBidder: string;
  userBidCredits: number;
  userJustBid: boolean;
  bidProgress: number;
}

export const AviatorAuction: React.FC<AviatorAuctionProps> = ({
  currentPrice,
  timeLeft,
  totalBidsPlaced,
  lastBidder,
  userBidCredits,
  userJustBid,
  bidProgress
}) => {
  const [catPosition, setCatPosition] = useState({ x: 10, y: 85 }); // Start at bottom left
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLeader, setCurrentLeader] = useState(lastBidder);
  const [previousLeader, setPreviousLeader] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number, id: number}>>([]);

  // Update cat animation when bidder changes
  useEffect(() => {
    if (lastBidder !== currentLeader) {
      setPreviousLeader(currentLeader);
      setCurrentLeader(lastBidder);
      
      // Reset cat to start position when new bidder takes lead
      setCatPosition({ x: 10, y: 85 });
      setIsAnimating(true);
      setZoomLevel(1);
      setTrailPoints([]);
      
      // Start animation to finish line
      const animationTimer = setTimeout(() => {
        const progress = bidProgress || 0;
        const targetX = 10 + (80 * progress / 100); // Move across screen
        const targetY = 85 - (70 * progress / 100); // Move up screen
        setCatPosition({ x: targetX, y: targetY });
        setZoomLevel(1 + (progress / 100) * 0.5); // Zoom effect
      }, 100);

      return () => clearTimeout(animationTimer);
    }
  }, [lastBidder, currentLeader, bidProgress]);

  // Animate cat position based on time/bid progress
  useEffect(() => {
    if (userJustBid && lastBidder === 'შენ') {
      const progress = bidProgress;
      const targetX = 10 + (80 * progress / 100);
      const targetY = 85 - (70 * progress / 100);
      setCatPosition({ x: targetX, y: targetY });
      setZoomLevel(1 + (progress / 100) * 0.8); // More dramatic zoom for user
      
      // Add trail points
      setTrailPoints(prev => [...prev.slice(-5), { x: targetX, y: targetY, id: Date.now() }]);
    } else if (lastBidder !== 'შენ' && timeLeft > 0) {
      // For other bidders, animate based on remaining time
      const timeProgress = (15 - timeLeft) / 15 * 100;
      const targetX = 10 + (80 * timeProgress / 100);
      const targetY = 85 - (70 * timeProgress / 100);
      setCatPosition({ x: targetX, y: targetY });
      setZoomLevel(1 + (timeProgress / 100) * 0.6); // Moderate zoom for others
      
      // Add trail points
      setTrailPoints(prev => [...prev.slice(-4), { x: targetX, y: targetY, id: Date.now() }]);
    }
  }, [timeLeft, bidProgress, userJustBid, lastBidder]);

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-900/90 to-purple-900/90 border-blue-500/20 shadow-lg overflow-hidden">
      {/* Aviator Game Area */}
      <div 
        className="relative h-48 sm:h-56 bg-gradient-to-t from-blue-800/30 to-transparent rounded-lg mb-4 overflow-hidden transition-transform duration-1000 ease-out"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Grid pattern background with zoom effect */}
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-1000"
          style={{ transform: `scale(${zoomLevel * 1.2})` }}
        >
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Finish Line */}
        <div className="absolute top-2 right-2 flex flex-col items-center text-white/80">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mb-1">
            🏁
          </div>
          <span className="text-xs font-bold">FINISH</span>
        </div>

        {/* Trail Effect */}
        {trailPoints.map((point, index) => (
          <div
            key={point.id}
            className="absolute transition-all duration-1000 pointer-events-none"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: (index + 1) / trailPoints.length * 0.6
            }}
          >
            <div className="w-3 h-3 bg-yellow-400/60 rounded-full animate-pulse"></div>
          </div>
        ))}

        {/* Flying Cat Player */}
        <div 
          className="absolute transition-all duration-1000 ease-out transform"
          style={{ 
            left: `${catPosition.x}%`, 
            top: `${catPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            {/* Flying Cat with Flapping Ears */}
            <div className="text-2xl sm:text-3xl relative">
              🐱
              {/* Flapping ear effects */}
              <div className="absolute -top-1 -left-1 text-lg animate-pulse">👂</div>
              <div className="absolute -top-1 -right-1 text-lg animate-pulse" style={{ animationDelay: '0.1s' }}>👂</div>
              {/* Wing flap effect */}
              <div className="absolute inset-0 animate-bounce" style={{ animationDuration: '0.5s' }}>
                <div className="absolute -left-2 top-1 text-sm opacity-70 animate-ping">✨</div>
                <div className="absolute -right-2 top-1 text-sm opacity-70 animate-ping" style={{ animationDelay: '0.2s' }}>✨</div>
              </div>
            </div>
            {/* Player name bubble */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              {lastBidder}
            </div>
            {/* Enhanced trail effect when moving */}
            {isAnimating && (
              <>
                <div className="absolute inset-0 bg-yellow-300/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-blue-300/20 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
              </>
            )}
          </div>
        </div>

        {/* Multiplier Display */}
        <div className="absolute top-4 left-4 text-white">
          <div className="text-lg sm:text-xl font-bold">
            {(currentPrice * 100).toFixed(0)}x
          </div>
          <div className="text-xs opacity-80">მრავლისაძღვნა</div>
        </div>

        {/* Progress Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d={`M 10% 85% Q ${catPosition.x}% ${catPosition.y}% 90% 15%`}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-white/80">მიმდინარე ფასი</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{currentPrice.toFixed(2)} ₾</p>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-white/80">დარჩენილი დრო</p>
          <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 5 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
            {String(timeLeft).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-white/80">
        <div className="flex items-center gap-1">
          <Gavel className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{totalBidsPlaced} ბიდი</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>ლიდერი: {lastBidder}</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{userBidCredits} ბიდი</span>
        </div>
      </div>

      {/* Crash warning when time is low */}
      {timeLeft <= 5 && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none rounded-lg">
          <div className="flex items-center justify-center h-full">
            <span className="text-red-400 font-bold text-lg animate-bounce">⚠️ CRASH INCOMING!</span>
          </div>
        </div>
      )}
    </Card>
  );
};