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

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Gavel, Users, Coins, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { JetCat } from './JetCat';
import { LuckyCoin } from './LuckyCoin';

import confetti from 'canvas-confetti';

interface AviatorAuctionProps {
  currentPrice: number;           // Current auction price
  timeLeft: number;              // Seconds remaining
  totalBidsPlaced: number;       // Total bids on this auction
  lastBidder: string;            // Current highest bidder
  userBidCredits: number;        // User's remaining bid credits
  userJustBid: boolean;          // Whether user just placed a bid
  bidProgress: number;           // Progress percentage (0-100)
  isAuctionEnded?: boolean;      // Whether auction has ended
  onBonusBidCollected?: (collectorId: string) => void; // Callback when bonus bid is collected - collectorId indicates who collected it
}

export const AviatorAuction: React.FC<AviatorAuctionProps> = ({
  currentPrice,
  timeLeft,
  totalBidsPlaced,
  lastBidder,
  userBidCredits,
  userJustBid,
  bidProgress,
  isAuctionEnded = false,
  onBonusBidCollected
}) => {
  // ANIMATION STATE
  const [jetPosition, setJetPosition] = useState({ x: 10, y: 85 }); // Jet position (x: left-right, y: top-bottom)
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLeader, setCurrentLeader] = useState(lastBidder);
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom effect for excitement
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number, id: number}>>([]);
  const [milliseconds, setMilliseconds] = useState(0); // Millisecond counter
  const [isExploding, setIsExploding] = useState(false); // Explosion state
  const [showBlowUpMessage, setShowBlowUpMessage] = useState(false); // Show "YOU BLEW UP JET" message
  const [soundEnabled, setSoundEnabled] = useState(true); // Sound effects toggle
  
  // LUCKY COIN STATE
  const [coinPosition, setCoinPosition] = useState({ x: 50, y: 50 });
  const [isCoinVisible, setIsCoinVisible] = useState(false);
  const [coinCollectedThisRound, setCoinCollectedThisRound] = useState(false);
  const [userCollectedThisRound, setUserCollectedThisRound] = useState(false);
  const [showBonusMessage, setShowBonusMessage] = useState(false);

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

  // Reset states when main timer resets
  useEffect(() => {
    if (timeLeft === 10) { // When timer resets to full
      setMilliseconds(99);
      setCoinCollectedThisRound(false);
      setUserCollectedThisRound(false); // Reset user collection flag
      setShowBonusMessage(false);
    }
  }, [timeLeft]);

  // SOUND EFFECTS FUNCTIONS
  const playExplosionSound = () => {
    if (!soundEnabled) return;
    try {
      // Create explosion sound using Web Audio API
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Explosion sound - low frequency burst
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playWinningSound = () => {
    if (!soundEnabled) return;
    try {
      // Create winning swoosh sound
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Winning swoosh - rising frequency
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // JET ANIMATION - Update position when bidder changes
  useEffect(() => {
    if (lastBidder !== currentLeader) {
      // Trigger explosion for previous jet
      if (currentLeader && lastBidder === 'შენ') {
        // Show "YOU BLEW UP JET" message when user bids
        setShowBlowUpMessage(true);
        playWinningSound(); // Play winning sound when user becomes leader
        setTimeout(() => setShowBlowUpMessage(false), 3000); // Hide after 3 seconds
      }
      
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

  // CONTINUOUS ANIMATION - Update jet position based on progress with bounds checking
  useEffect(() => {
    if (!isExploding) {
      if (userJustBid && lastBidder === 'შენ') {
        // User bid - animate based on bid progress
        const progress = Math.min(bidProgress, 100); // Ensure max 100%
        const targetX = Math.min(10 + (80 * progress / 100), 90); // Cap at 90%
        const targetY = Math.max(85 - (70 * progress / 100), 15); // Cap at 15%
        setJetPosition({ x: targetX, y: targetY });
        setZoomLevel(1 + (progress / 100) * 0.3);
        
        // Add trail point
        setTrailPoints(prev => [...prev.slice(-5), { x: targetX, y: targetY, id: Date.now() }]);
      } else if (lastBidder !== 'შენ' && timeLeft > 0) {
        // Other bidders - animate based on time remaining with bounds checking
        const timeProgress = Math.min((10 - timeLeft) / 10 * 100, 100); // Ensure max 100%
        const targetX = Math.min(10 + (80 * timeProgress / 100), 90); // Cap at 90%
        const targetY = Math.max(85 - (70 * timeProgress / 100), 15); // Cap at 15%
        setJetPosition({ x: targetX, y: targetY });
        setZoomLevel(1 + (timeProgress / 100) * 0.2);
        
        // Add trail point
        setTrailPoints(prev => [...prev.slice(-4), { x: targetX, y: targetY, id: Date.now() }]);
      }
    }
  }, [timeLeft, bidProgress, userJustBid, lastBidder, isExploding]);

  // LUCKY COIN SPAWNING - Only appear in last 4-5 seconds if not collected this round
  useEffect(() => {
    if (isAuctionEnded || isCoinVisible || timeLeft > 5 || timeLeft <= 0 || coinCollectedThisRound) return;
    
    const spawnCoin = () => {
      // Only spawn during last 4-5 seconds (timeLeft 1-5) and if no coin collected this round
      if (timeLeft >= 1 && timeLeft <= 5 && !coinCollectedThisRound) {
        // Spawn coin ahead of the jet on its path
        const currentJetX = jetPosition.x;
        const currentJetY = jetPosition.y;
        
        // Calculate the jet's direction and place coin ahead on the path
        const progressPercent = bidProgress || ((10 - timeLeft) / 10 * 100);
        const futureProgress = Math.min(progressPercent + 15, 100); // 15% ahead of current position
        
        const coinX = 10 + (80 * futureProgress / 100); // Follow the same path formula
        const coinY = 85 - (70 * futureProgress / 100); // Follow the same path formula
        
        setCoinPosition({ x: coinX, y: coinY });
        setIsCoinVisible(true);
        
        // Auto-hide coin after timeLeft seconds (so it disappears when timer resets)
        setTimeout(() => {
          setIsCoinVisible(false);
        }, timeLeft * 1000);
      }
    };
    
    // Spawn coin immediately when entering the 1-5 second window
    spawnCoin();
    
  }, [isAuctionEnded, isCoinVisible, jetPosition.x, jetPosition.y, bidProgress, timeLeft, coinCollectedThisRound]);

  // User collision detection - highest priority
  useEffect(() => {
    if (!isCoinVisible || coinCollectedThisRound) {
      return;
    }
    
    console.log('Collision check - timeLeft:', timeLeft, 'userCollectedThisRound:', userCollectedThisRound);
    
    const jetX = isAuctionEnded ? 90 : jetPosition.x;
    const jetY = isAuctionEnded ? 15 : jetPosition.y;
    const distance = Math.sqrt(
      Math.pow(jetX - coinPosition.x, 2) + Math.pow(jetY - coinPosition.y, 2)
    );
    
    console.log('Distance check:', distance, 'jetPos:', {x: jetX, y: jetY}, 'coinPos:', coinPosition);
    
    if (distance < 8) {
      console.log('🎯 USER COLLISION DETECTED - COLLECTING COIN');
      setIsCoinVisible(false);
      setCoinCollectedThisRound(true);
      setUserCollectedThisRound(true);
      setShowBonusMessage(true);
      setTimeout(() => setShowBonusMessage(false), 3000);
      playWinningSound();
      
      if (onBonusBidCollected) {
        console.log('✅ Calling onBonusBidCollected with: შენ (collision)');
        onBonusBidCollected('შენ');
      }
    }
  }, [jetPosition, coinPosition, isCoinVisible, isAuctionEnded, coinCollectedThisRound, userCollectedThisRound, onBonusBidCollected]);

  // Other players collect coin - only if user hasn't collected it yet
  useEffect(() => {
    console.log('Other player check - timeLeft:', timeLeft, 'isCoinVisible:', isCoinVisible, 'coinCollectedThisRound:', coinCollectedThisRound, 'userCollectedThisRound:', userCollectedThisRound);
    
    if (!isCoinVisible || coinCollectedThisRound || userCollectedThisRound) {
      console.log('Other player collection blocked - coin already handled');
      return;
    }
    
    // More predictable timing - only at exact timeLeft = 5
    if (timeLeft === 5) {
      const chance = Math.random();
      console.log('Other player collection chance:', chance, 'threshold: 0.75');
      
      // Higher chance (75%) for other players to collect
      if (chance < 0.75) {
        const randomPlayer = ['ლევანი', 'თამარი', 'გიორგი', 'მარიამი', 'დავითი'][Math.floor(Math.random() * 5)];
        console.log('🤖 OTHER PLAYER COLLECTED COIN:', randomPlayer);
        
        setIsCoinVisible(false);
        setCoinCollectedThisRound(true);
        setShowBonusMessage(true);
        setTimeout(() => setShowBonusMessage(false), 3000);
        
        if (onBonusBidCollected) {
          console.log('❌ Calling onBonusBidCollected with:', randomPlayer);
          onBonusBidCollected(randomPlayer);
        }
      } else {
        console.log('🎯 User gets a chance to collect this coin');
      }
    }
  }, [timeLeft, isCoinVisible, coinCollectedThisRound, userCollectedThisRound, onBonusBidCollected]);

  // Handle coin collection (manual click) - separate from automatic logic
  const handleCoinCollect = () => {
    if (!isCoinVisible || coinCollectedThisRound) return;
    
    console.log('User collected coin by manual click');
    setIsCoinVisible(false);
    setCoinCollectedThisRound(true);
    setUserCollectedThisRound(true);
    setShowBonusMessage(true);
    setTimeout(() => setShowBonusMessage(false), 3000);
    playWinningSound();
    
    if (onBonusBidCollected) {
      console.log('Calling onBonusBidCollected with: შენ (manual)');
      onBonusBidCollected('შენ');
    }
  };


  // CONFETTI EFFECT FOR AUCTION ENDED
  useEffect(() => {
    if (isAuctionEnded) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Create confetti over the game area
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.9), y: 0.1 } 
        }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isAuctionEnded]);

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-900/90 to-purple-900/90 border-blue-500/20 shadow-lg overflow-hidden relative z-10 mt-16">
      {/* SOUND TOGGLE - Top left corner */}
      <div className="absolute top-2 left-2 z-50">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-2 transition-colors"
          title={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/60" />
          )}
        </button>
      </div>

      {/* GAME AREA */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-t from-blue-800/30 to-transparent rounded-lg mb-4 overflow-hidden z-10">
        
        {/* "YOU BLEW UP JET" MESSAGE - At the very top center of animation */}
        {showBlowUpMessage && (
          <div className="absolute top-2 inset-x-0 z-40 animate-bounce">
            <div className="mx-auto w-fit bg-red-500/90 text-white px-3 py-1 rounded-lg font-bold text-xs sm:text-sm shadow-lg border border-red-400">
              <span className="emoji-consistent mr-1">💥</span>
              YOU BLEW UP JET
              <span className="emoji-consistent ml-1">🚀💨</span>
            </div>
          </div>
        )}

        {/* BONUS MESSAGE - Small notification for all bonus collections */}
        {showBonusMessage && (
          <div className="absolute top-8 inset-x-0 z-40 animate-bounce">
            <div className="mx-auto w-fit bg-yellow-500/90 text-white px-3 py-1 rounded-lg font-bold text-xs sm:text-sm shadow-lg border border-yellow-400">
              <span className="emoji-consistent mr-1">💰</span>
              GOT BONUS BID
              <span className="emoji-consistent ml-1">🎰✨</span>
            </div>
          </div>
        )}

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

        {/* LUCKY COIN */}
        <LuckyCoin
          x={coinPosition.x}
          y={coinPosition.y}
          isVisible={isCoinVisible && !isAuctionEnded}
          onCollect={handleCoinCollect}
        />

        {/* FLYING JET CAT */}
        <div className="absolute inset-0">
          <div 
            className="absolute transition-all duration-1000 ease-out transform z-20"
            style={{ 
              left: isAuctionEnded ? '90%' : `${jetPosition.x}%`, 
              top: isAuctionEnded ? '15%' : `${jetPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <JetCat 
                bidder={currentLeader} 
                isUser={currentLeader === 'შენ'} 
                isExploding={isExploding}
                isAuctionEnded={isAuctionEnded}
              />
              {/* Movement effects */}
              {isAnimating && !isExploding && !isAuctionEnded && (
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

        {/* CENTER TIMER OR AUCTION ENDED */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30">
          {isAuctionEnded ? (
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 drop-shadow-lg mb-2">
                SOLD FOR
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {currentPrice.toFixed(2)} ₾
              </div>
            </div>
          ) : (
            <>
              <div className={`text-4xl sm:text-6xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'} drop-shadow-lg flex items-center justify-center gap-1`}>
                <span className="tabular-nums">{String(timeLeft).padStart(2, '0')}</span>
                <span className="text-2xl sm:text-3xl text-white/70 tabular-nums">.{String(milliseconds).padStart(2, '0')}</span>
              </div>
              <div className="text-xs sm:text-sm text-white/80 mt-1">SECONDS</div>
            </>
          )}
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
      {timeLeft <= 3 && !isAuctionEnded && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none rounded-lg">
          <div className="flex items-center justify-center h-full">
            <span className="text-red-400 font-bold text-lg animate-bounce">⚠️ CRASH INCOMING!</span>
          </div>
        </div>
      )}

    </Card>
  );
};
