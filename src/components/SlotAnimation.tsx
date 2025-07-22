import React, { useEffect, useState } from 'react';

interface SlotAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const SlotAnimation: React.FC<SlotAnimationProps> = ({ isVisible, onComplete }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsSpinning(true);
      
      // Slot machine spinning effect
      const interval = setInterval(() => {
        setCurrentNumber(prev => (prev + 1) % 10);
      }, 100);
      
      // Stop spinning after 2 seconds and show final result
      setTimeout(() => {
        clearInterval(interval);
        setCurrentNumber(1); // Always show +1 bid
        setIsSpinning(false);
        
        // Complete animation after showing result
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 animate-pulse"></div>
      
      {/* Slot machine container */}
      <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 shadow-2xl border-4 border-yellow-300 animate-bounce">
        {/* Slot machine header */}
        <div className="text-center mb-4">
          <div className="text-white font-bold text-lg">LUCKY BONUS!</div>
          <div className="text-yellow-100 text-sm">🎰 BONUS BID 🎰</div>
        </div>
        
        {/* Slot display */}
        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {isSpinning ? (
                <span className="animate-pulse">🎲</span>
              ) : (
                <span className="animate-bounce">+{currentNumber}</span>
              )}
            </div>
            <div className="text-yellow-100 text-sm">
              {isSpinning ? 'SPINNING...' : 'BID BONUS!'}
            </div>
          </div>
        </div>
        
        {/* Celebration effects */}
        {!isSpinning && (
          <>
            <div className="absolute -top-4 -left-4 text-2xl animate-bounce">🎉</div>
            <div className="absolute -top-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</div>
            <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎊</div>
            <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎊</div>
            
            {/* Sparkles around */}
            <div className="absolute top-1/2 -left-8 text-lg animate-ping">✨</div>
            <div className="absolute top-1/2 -right-8 text-lg animate-ping" style={{ animationDelay: '0.3s' }}>✨</div>
            <div className="absolute -top-8 left-1/2 text-lg animate-ping" style={{ animationDelay: '0.6s' }}>⭐</div>
            <div className="absolute -bottom-8 left-1/2 text-lg animate-ping" style={{ animationDelay: '0.9s' }}>⭐</div>
          </>
        )}
      </div>
    </div>
  );
};