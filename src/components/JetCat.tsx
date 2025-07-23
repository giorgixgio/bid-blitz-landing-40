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
        {/* Main explosion - bigger and more dramatic */}
        <div className="absolute inset-0 animate-ping">
          <div className="text-6xl sm:text-7xl">💥</div>
        </div>
        
        {/* Secondary explosion effects */}
        <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.1s' }}>
          <div className="text-5xl sm:text-6xl opacity-90">🔥</div>
        </div>
        
        <div className="absolute inset-0 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="text-4xl sm:text-5xl opacity-80">💨</div>
        </div>
        
        {/* Multiple explosion bursts */}
        <div className="absolute -top-4 -left-4 animate-ping text-3xl opacity-80">💥</div>
        <div className="absolute -top-4 -right-4 animate-ping text-3xl opacity-80" style={{ animationDelay: '0.15s' }}>💥</div>
        <div className="absolute -bottom-4 -left-4 animate-ping text-3xl opacity-80" style={{ animationDelay: '0.3s' }}>💥</div>
        <div className="absolute -bottom-4 -right-4 animate-ping text-3xl opacity-80" style={{ animationDelay: '0.45s' }}>💥</div>
        
        {/* Flying debris */}
        <div className="absolute -top-6 left-0 animate-bounce text-2xl opacity-70" style={{ animationDelay: '0.1s' }}>⚡</div>
        <div className="absolute -top-6 right-0 animate-bounce text-2xl opacity-70" style={{ animationDelay: '0.25s' }}>⚡</div>
        <div className="absolute -bottom-6 left-0 animate-bounce text-2xl opacity-70" style={{ animationDelay: '0.4s' }}>💫</div>
        <div className="absolute -bottom-6 right-0 animate-bounce text-2xl opacity-70" style={{ animationDelay: '0.55s' }}>💫</div>
        
        {/* Scattered jet pieces */}
        <div className="absolute -top-8 -left-8 animate-spin text-xl opacity-60" style={{ animationDelay: '0.2s' }}>🔩</div>
        <div className="absolute -top-8 -right-8 animate-spin text-xl opacity-60" style={{ animationDelay: '0.35s' }}>⚙️</div>
        <div className="absolute -bottom-8 -left-8 animate-bounce text-xl opacity-60" style={{ animationDelay: '0.5s' }}>🔥</div>
        <div className="absolute -bottom-8 -right-8 animate-bounce text-xl opacity-60" style={{ animationDelay: '0.65s' }}>💨</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Jet body - bigger with consistent emoji font */}
      <div className="text-5xl sm:text-6xl relative">
        {/* Force consistent emoji rendering with Noto Color Emoji */}
        <span className="emoji-consistent inline-block">
          🚀
        </span>
        {/* Cat head sticking out of jet window - bigger and more prominent */}
        <div className="absolute top-1/4 left-1/5 transform -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl bg-white/30 rounded-full px-1 backdrop-blur-sm border border-white/40 shadow-lg">
          <span className="emoji-consistent">
            🐱
          </span>
        </div>
        {/* Crown for user or winner */}
        {(isUser || isAuctionEnded) && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
            <span className="emoji-consistent">
              👑
            </span>
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