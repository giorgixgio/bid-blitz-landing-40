/**
 * AVIATOR AUCTION COMPONENT
 * =========================
 * 
 * This component displays an aviator-style game interface showing:
 * - Flying cat animation that moves based on bid progress
 * - Real-time countdown timer with milliseconds
 * - Current price and multiplier display
 * - Game statistics (total bids, leader, user credits)
 * - Visual effects like trails and crash warnings
 */

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Gavel, Users, Coins, Smartphone } from 'lucide-react';
import { JetCat } from './JetCat';

interface AviatorAuctionProps {
  currentPrice: number;           // Current auction price
  timeLeft: number;              // Seconds remaining
  totalBidsPlaced: number;       // Total bids on this auction
  lastBidder: string;            // Current highest bidder
  userBidCredits: number;        // User's remaining bid credits
  userJustBid: boolean;          // Whether user just placed a bid
  bidProgress: number;           // Progress percentage (0-100)
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
  // ANIMATION STATE
  const [jetPosition, setJetPosition] = useState({ x: 10, y: 85 }); // Jet position (x: left-right, y: top-bottom)
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLeader, setCurrentLeader] = useState(lastBidder);
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom effect for excitement
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number, id: number}>>([]);
  const [milliseconds, setMilliseconds] = useState(0); // Millisecond counter
  const [isExploding, setIsExploding] = useState(false); // Explosion state

  // MILLISECONDS COUNTDOWN - Creates smooth timer animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMilliseconds(prev => {
        if (prev <= 0) {
          return 99; // Reset to 99 when reaching 0
        }
        return prev - 1;
      });
    }, 10); // Update every 10ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  // Reset milliseconds when main timer resets
  useEffect(() => {
    if (timeLeft === 10) { // When timer resets to full
      setMilliseconds(99);
    }
  }, [timeLeft]);

  // JET ANIMATION - Update position when bidder changes
  useEffect(() => {
    if (lastBidder !== currentLeader) {
      // Trigger explosion for previous jet
      if (currentLeader) {
        setIsExploding(true);
        
        // Stop explosion after animation
        setTimeout(() => {
          setIsExploding(false);
          setCurrentLeader(lastBidder);
          
          // Reset jet to start position for new leader
          setJetPosition({ x: 10, y: 85 });
          setIsAnimating(true);
          setZoomLevel(1);
          setTrailPoints([]);
          
          // Animate to progress position
          setTimeout(() => {
            const progress = bidProgress || 0;
            const targetX = 10 + (80 * progress / 100); // Move across screen
            const targetY = 85 - (70 * progress / 100); // Move up screen
            setJetPosition({ x: targetX, y: targetY });
            setZoomLevel(1 + (progress / 100) * 0.2);
          }, 200);
        }, 1000);
      } else {
        // First load
        setCurrentLeader(lastBidder);
        setJetPosition({ x: 10, y: 85 });
      }
    }
  }, [lastBidder, currentLeader, bidProgress]);

  // CONTINUOUS ANIMATION - Update jet position based on progress
  useEffect(() => {
    if (!isExploding) {
      if (userJustBid && lastBidder === 'შენ') {
        // User bid - animate based on bid progress
        const progress = bidProgress;
        const targetX = 10 + (80 * progress / 100);
        const targetY = 85 - (70 * progress / 100);
        setJetPosition({ x: targetX, y: targetY });
        setZoomLevel(1 + (progress / 100) * 0.3);
        
        // Add trail point
        setTrailPoints(prev => [...prev.slice(-5), { x: targetX, y: targetY, id: Date.now() }]);
      } else if (lastBidder !== 'შენ' && timeLeft > 0) {
        // Other bidders - animate based on time remaining
        const timeProgress = (10 - timeLeft) / 10 * 100;
        const targetX = 10 + (80 * timeProgress / 100);
        const targetY = 85 - (70 * timeProgress / 100);
        setJetPosition({ x: targetX, y: targetY });
        setZoomLevel(1 + (timeProgress / 100) * 0.2);
        
        // Add trail point
        setTrailPoints(prev => [...prev.slice(-4), { x: targetX, y: targetY, id: Date.now() }]);
      }
    }
  }, [timeLeft, bidProgress, userJustBid, lastBidder, isExploding]);

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-900/90 to-purple-900/90 border-blue-500/20 shadow-lg overflow-hidden relative z-50">
      {/* GAME AREA */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-t from-blue-800/30 to-transparent rounded-lg mb-4 overflow-hidden z-50">
        
        {/* Background with zoom effect */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out origin-bottom-left"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* FINISH LINE */}
        <div className="absolute top-2 right-2 flex flex-col items-center text-white/80 z-20">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mb-1">
            🏁
          </div>
          <span className="text-xs font-bold">FINISH</span>
        </div>

        {/* TRAIL EFFECTS */}
        <div className="absolute inset-0">
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
              <div className="w-2 h-1 bg-orange-400 rounded opacity-80 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* FLYING JET CAT */}
        <div className="absolute inset-0">
          <div 
            className="absolute transition-all duration-1000 ease-out transform"
            style={{ 
              left: `${jetPosition.x}%`, 
              top: `${jetPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <JetCat 
                bidder={currentLeader} 
                isUser={currentLeader === 'შენ'} 
                isExploding={isExploding}
              />
              {/* Movement effects */}
              {isAnimating && !isExploding && (
                <>
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    currentLeader === 'შენ' ? 'bg-yellow-300/50' : 'bg-blue-300/30'
                  }`}></div>
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    currentLeader === 'შენ' ? 'bg-yellow-400/30' : 'bg-blue-300/20'
                  }`} style={{ animationDelay: '0.3s' }}></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CENTER TIMER */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30">
          <div className={`text-4xl sm:text-6xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'} drop-shadow-lg flex items-center justify-center gap-1`}>
            <span>{String(timeLeft).padStart(2, '0')}</span>
            <span className="text-2xl sm:text-3xl text-white/70">.{String(milliseconds).padStart(2, '0')}</span>
          </div>
          <div className="text-xs sm:text-sm text-white/80 mt-1">SECONDS</div>
        </div>

        {/* PROGRESS LINE */}
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M 10% 85% Q ${jetPosition.x}% ${jetPosition.y}% 90% 15%`}
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-white/80">მიმდინარე ფასი</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{currentPrice.toFixed(2)} ₾</p>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-white/80">მულტიპლაიერი</p>
          <div className="text-xl sm:text-2xl font-bold text-yellow-400">
            {(currentPrice * 100).toFixed(0)}x
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

      {/* CRASH WARNING */}
      {timeLeft <= 3 && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none rounded-lg">
          <div className="flex items-center justify-center h-full">
            <span className="text-red-400 font-bold text-lg animate-bounce">⚠️ CRASH INCOMING!</span>
          </div>
        </div>
      )}
    </Card>
  );
};
