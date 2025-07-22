import React from 'react';

interface JetCatProps {
  bidder: string;
  isUser: boolean;
  isExploding: boolean;
  isAuctionEnded?: boolean;
}

export const JetCat: React.FC<JetCatProps> = ({ bidder, isUser, isExploding, isAuctionEnded = false }) => {
  if (isExploding) {
    return (
      <div className="relative">
        {/* Explosion effects */}
        <div className="absolute inset-0 animate-ping">
          <div className="text-4xl">💥</div>
        </div>
        <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.1s' }}>
          <div className="text-3xl opacity-80">🔥</div>
        </div>
        <div className="absolute inset-0 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="text-2xl opacity-60">💨</div>
        </div>
        {/* Debris */}
        <div className="absolute -top-2 -left-2 animate-ping text-sm opacity-70">⚡</div>
        <div className="absolute -top-2 -right-2 animate-ping text-sm opacity-70" style={{ animationDelay: '0.15s' }}>⚡</div>
        <div className="absolute -bottom-2 -left-2 animate-ping text-sm opacity-70" style={{ animationDelay: '0.3s' }}>💫</div>
        <div className="absolute -bottom-2 -right-2 animate-ping text-sm opacity-70" style={{ animationDelay: '0.45s' }}>💫</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Jet body - Custom styled jet instead of emoji */}
      <div className="text-3xl sm:text-4xl relative flex items-center justify-center">
        {/* Custom jet shape */}
        <div className="relative w-12 h-8 sm:w-16 sm:h-10">
          {/* Jet body */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full transform rotate-45"></div>
          {/* Jet nose */}
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
          {/* Jet wings */}
          <div className="absolute left-1 top-0 w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded transform -rotate-45"></div>
          <div className="absolute left-1 bottom-0 w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded transform rotate-45"></div>
          
          {/* Cat inside jet - more visible with background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg bg-white/20 rounded-full px-1 backdrop-blur-sm border border-white/30">
            🐱
          </div>
        </div>
        
        {/* Crown for user or winner */}
        {(isUser || isAuctionEnded) && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
            👑
          </div>
        )}
        {/* Jet trail */}
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
          <div className="flex gap-1 animate-pulse">
            <div className="w-2 h-1 bg-orange-400 rounded opacity-80"></div>
            <div className="w-2 h-1 bg-yellow-400 rounded opacity-60"></div>
            <div className="w-2 h-1 bg-red-400 rounded opacity-40"></div>
          </div>
        </div>
      </div>
      
      {/* Player name bubble */}
      <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-bold whitespace-nowrap z-10 ${
        isUser 
          ? 'bg-yellow-400/90 text-black border-2 border-yellow-300 shadow-lg' 
          : 'bg-white/90 text-black border border-gray-300'
      }`}>
        {bidder}
      </div>
    </div>
  );
};