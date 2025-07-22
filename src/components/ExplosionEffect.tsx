
import React, { useEffect, useState } from 'react';

interface ExplosionEffectProps {
  position: { x: number; y: number };
  isActive: boolean;
  onComplete: () => void;
}

export const ExplosionEffect: React.FC<ExplosionEffectProps> = ({
  position,
  isActive,
  onComplete
}) => {
  const [phase, setPhase] = useState<'explosion' | 'smoke' | 'complete'>('explosion');
  const [debris, setDebris] = useState<Array<{ id: number; x: number; y: number; rotation: number }>>([]);

  useEffect(() => {
    if (!isActive) return;

    // Phase 1: Explosion (500ms)
    setPhase('explosion');
    
    // Generate debris particles
    const debrisArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 40 - 20, // Random spread around explosion center
      y: Math.random() * 40 - 20,
      rotation: Math.random() * 360
    }));
    setDebris(debrisArray);

    const smokeTimer = setTimeout(() => {
      setPhase('smoke');
    }, 500);

    const completeTimer = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 1300);

    return () => {
      clearTimeout(smokeTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive || phase === 'complete') return null;

  return (
    <div 
      className="absolute pointer-events-none z-30"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Main Explosion */}
      {phase === 'explosion' && (
        <>
          <div className="absolute inset-0 w-16 h-16 bg-orange-500 rounded-full animate-ping opacity-80"></div>
          <div className="absolute inset-0 w-12 h-12 bg-red-500 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute inset-0 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-100" style={{ animationDelay: '0.2s' }}></div>
          
          {/* Fire Emojis */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-pulse">💥</span>
          </div>
        </>
      )}

      {/* Smoke Phase */}
      {phase === 'smoke' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl opacity-70 animate-pulse">💨</div>
          <div className="text-2xl opacity-50 animate-pulse ml-2" style={{ animationDelay: '0.3s' }}>💨</div>
        </div>
      )}

      {/* Debris */}
      {debris.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-gray-600 rounded animate-bounce"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            transform: `rotate(${piece.rotation}deg)`,
            animationDuration: '0.8s',
            animationDelay: `${piece.id * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};
