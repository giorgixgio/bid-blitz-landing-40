import React from 'react';

interface LuckyCoinProps {
  x: number;
  y: number;
  isVisible: boolean;
  onCollect: () => void;
}

export const LuckyCoin: React.FC<LuckyCoinProps> = ({ x, y, isVisible, onCollect }) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute transition-all duration-300 ease-out transform"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Glowing effect */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-8 h-8 bg-yellow-400/30 rounded-full"></div>
      </div>
      
      {/* Main coin */}
      <div className="relative w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-2 border-yellow-200 shadow-lg animate-bounce">
        {/* Coin center */}
        <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-yellow-800 emoji-consistent">💰</span>
        </div>
        
        {/* Sparkle effects */}
        <div className="absolute -top-1 -left-1 text-xs animate-pulse">✨</div>
        <div className="absolute -top-1 -right-1 text-xs animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute -bottom-1 -left-1 text-xs animate-pulse" style={{ animationDelay: '0.6s' }}>✨</div>
        <div className="absolute -bottom-1 -right-1 text-xs animate-pulse" style={{ animationDelay: '0.9s' }}>✨</div>
      </div>
    </div>
  );
};