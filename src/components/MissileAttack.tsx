
import React, { useEffect, useState } from 'react';

interface MissileAttackProps {
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  isActive: boolean;
  onImpact: () => void;
}

export const MissileAttack: React.FC<MissileAttackProps> = ({
  startPosition,
  targetPosition,
  isActive,
  onImpact
}) => {
  const [missilePosition, setMissilePosition] = useState(startPosition);
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setIsLaunched(true);
    setMissilePosition(startPosition);

    // Launch missile with delay
    const launchTimer = setTimeout(() => {
      setMissilePosition(targetPosition);
    }, 200);

    // Impact after travel time
    const impactTimer = setTimeout(() => {
      onImpact();
      setIsLaunched(false);
    }, 700);

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(impactTimer);
    };
  }, [isActive, startPosition, targetPosition, onImpact]);

  if (!isActive || !isLaunched) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div 
        className="absolute transition-all duration-500 ease-linear"
        style={{ 
          left: `${missilePosition.x}%`, 
          top: `${missilePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Missile */}
        <div className="relative">
          <span className="text-lg">🚀</span>
          
          {/* Missile Trail */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-orange-400 rounded animate-pulse"></div>
              <div className="w-1 h-1 bg-red-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-0.5 h-0.5 bg-yellow-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
