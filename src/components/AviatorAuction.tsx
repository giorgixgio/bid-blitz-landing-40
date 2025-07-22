/**
 * AVIATOR AUCTION COMPONENT - JET COMBAT VERSION
 * ==============================================
 * 
 * This component displays a jet combat auction interface featuring:
 * - Jets representing current bidders that get destroyed when outbid
 * - Missile attack animations between competing bidders
 * - Explosion effects with debris when jets are destroyed
 * - Victory animations for successful bidders
 */

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Gavel, Users, Coins } from 'lucide-react';
import { JetAircraft } from './JetAircraft';
import { ExplosionEffect } from './ExplosionEffect';
import { MissileAttack } from './MissileAttack';

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
  // ANIMATION STATE
  const [jetPosition, setJetPosition] = useState({ x: 20, y: 75 });
  const [currentLeader, setCurrentLeader] = useState(lastBidder);
  const [milliseconds, setMilliseconds] = useState(0);
  
  // COMBAT ANIMATION STATE
  const [isExplosionActive, setIsExplosionActive] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });
  const [isMissileActive, setIsMissileActive] = useState(false);
  const [missileStart, setMissileStart] = useState({ x: 0, y: 0 });
  const [missileTarget, setMissileTarget] = useState({ x: 0, y: 0 });
  const [isVictorious, setIsVictorious] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'idle' | 'attacking' | 'exploding' | 'victory'>('idle');

  // MILLISECONDS COUNTDOWN
  useEffect(() => {
    const interval = setInterval(() => {
      setMilliseconds(prev => {
        if (prev <= 0) {
          return 99;
        }
        return prev - 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 10) {
      setMilliseconds(99);
    }
  }, [timeLeft]);

  // JET COMBAT ANIMATION - Triggered when bidder changes
  useEffect(() => {
    if (lastBidder !== currentLeader && currentLeader !== '' && battlePhase === 'idle') {
      console.log(`Battle initiated: ${currentLeader} vs ${lastBidder}`);
      
      // Phase 1: Launch missile attack
      setBattlePhase('attacking');
      const currentJetPos = jetPosition;
      const attackerPos = { x: 10, y: 30 }; // New bidder attacks from top-left
      
      setMissileStart(attackerPos);
      setMissileTarget(currentJetPos);
      setIsMissileActive(true);
      
      // Phase 2: Missile impact and explosion
      const explosionTimer = setTimeout(() => {
        setIsMissileActive(false);
        setExplosionPosition(currentJetPos);
        setIsExplosionActive(true);
        setBattlePhase('exploding');
      }, 700);

      // Phase 3: Victory and new jet positioning
      const victoryTimer = setTimeout(() => {
        setIsExplosionActive(false);
        setBattlePhase('victory');
        setCurrentLeader(lastBidder);
        
        // Position new jet based on progress
        const progress = bidProgress || (10 - timeLeft) / 10 * 100;
        const newX = 20 + (60 * progress / 100);
        const newY = 75 - (50 * progress / 100);
        setJetPosition({ x: newX, y: newY });
        
        // Victory celebration for user
        if (lastBidder === 'შენ') {
          setIsVictorious(true);
          setTimeout(() => setIsVictorious(false), 2000);
        }
        
        setBattlePhase('idle');
      }, 1800);

      return () => {
        clearTimeout(explosionTimer);
        clearTimeout(victoryTimer);
      };
    }
  }, [lastBidder, currentLeader, battlePhase]);

  // CONTINUOUS FLIGHT ANIMATION - Update jet position
  useEffect(() => {
    if (battlePhase === 'idle') {
      if (userJustBid && lastBidder === 'შენ') {
        const progress = bidProgress;
        const targetX = 20 + (60 * progress / 100);
        const targetY = 75 - (50 * progress / 100);
        setJetPosition({ x: targetX, y: targetY });
      } else if (lastBidder !== 'შენ' && timeLeft > 0) {
        const timeProgress = (10 - timeLeft) / 10 * 100;
        const targetX = 20 + (60 * timeProgress / 100);
        const targetY = 75 - (50 * timeProgress / 100);
        setJetPosition({ x: targetX, y: targetY });
      }
    }
  }, [timeLeft, bidProgress, userJustBid, lastBidder, battlePhase]);

  const handleExplosionComplete = () => {
    setIsExplosionActive(false);
  };

  const handleMissileImpact = () => {
    // Missile impact triggers explosion
    console.log('Missile impact!');
  };

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-900/90 to-purple-900/90 border-blue-500/20 shadow-lg overflow-hidden">
      {/* BATTLEFIELD */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-t from-blue-800/30 to-transparent rounded-lg mb-4 overflow-hidden">
        
        {/* Battlefield Background */}
        <div className="absolute inset-0">
          {/* Sky gradient with clouds */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-transparent"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="battlefield-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#battlefield-grid)" />
            </svg>
          </div>
        </div>

        {/* TARGET ZONE */}
        <div className="absolute top-2 right-2 flex flex-col items-center text-white/80 z-20">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-1 animate-pulse">
            🎯
          </div>
          <span className="text-xs font-bold">TARGET</span>
        </div>

        {/* CURRENT JET */}
        {battlePhase !== 'exploding' && (
          <JetAircraft
            bidderName={currentLeader}
            position={jetPosition}
            isExploding={battlePhase === 'attacking'}
            isVictorious={isVictorious}
            jetType={lastBidder === 'შენ' ? 'fighter' : 'passenger'}
          />
        )}

        {/* MISSILE ATTACK */}
        <MissileAttack
          startPosition={missileStart}
          targetPosition={missileTarget}
          isActive={isMissileActive}
          onImpact={handleMissileImpact}
        />

        {/* EXPLOSION EFFECT */}
        <ExplosionEffect
          position={explosionPosition}
          isActive={isExplosionActive}
          onComplete={handleExplosionComplete}
        />

        {/* CENTER TIMER */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30">
          <div className={`text-4xl sm:text-6xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'} drop-shadow-lg flex items-center justify-center gap-1`}>
            <span>{String(timeLeft).padStart(2, '0')}</span>
            <span className="text-2xl sm:text-3xl text-white/70">.{String(milliseconds).padStart(2, '0')}</span>
          </div>
          <div className="text-xs sm:text-sm text-white/80 mt-1">SECONDS</div>
        </div>

        {/* BATTLE STATUS */}
        {battlePhase !== 'idle' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              {battlePhase === 'attacking' && '🚀 MISSILE INCOMING!'}
              {battlePhase === 'exploding' && '💥 DIRECT HIT!'}
              {battlePhase === 'victory' && lastBidder === 'შენ' && '🏆 VICTORY!'}
            </div>
          </div>
        )}
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
            <span className="text-red-400 font-bold text-lg animate-bounce">⚠️ BATTLE INTENSIFYING!</span>
          </div>
        </div>
      )}
    </Card>
  );
};
