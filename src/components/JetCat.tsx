import React from 'react';

interface JetCatProps {
  bidder: string;
  isUser: boolean;
  isExploding: boolean;
}

export const JetCat: React.FC<JetCatProps> = ({ bidder, isUser, isExploding }) => {
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
      {/* Jet body */}
      <div className="text-3xl sm:text-4xl relative">
        🚀
        {/* Cat inside jet */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">
          🐱
        </div>
        {/* Crown for user */}
        {isUser && (
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