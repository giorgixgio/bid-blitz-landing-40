
import React from 'react';

interface JetAircraftProps {
  bidderName: string;
  position: { x: number; y: number };
  isExploding: boolean;
  isVictorious: boolean;
  jetType?: 'fighter' | 'passenger' | 'helicopter';
}

export const JetAircraft: React.FC<JetAircraftProps> = ({
  bidderName,
  position,
  isExploding,
  isVictorious,
  jetType = 'fighter'
}) => {
  const getJetEmoji = () => {
    switch (jetType) {
      case 'fighter': return '🛩️';
      case 'passenger': return '✈️';
      case 'helicopter': return '🚁';
      default: return '🛩️';
    }
  };

  return (
    <div 
      className="absolute transition-all duration-1000 ease-out transform"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={`relative ${isVictorious ? 'animate-bounce' : ''}`}>
        {/* Jet Aircraft */}
        <div className={`text-3xl sm:text-4xl relative ${isExploding ? 'animate-pulse' : ''}`}>
          {getJetEmoji()}
          
          {/* Jet Trail */}
          {!isExploding && (
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
              <div className="flex gap-1 opacity-60">
                <div className="w-2 h-1 bg-blue-300 rounded animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-0.5 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Pilot Name Cockpit */}
        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
          bidderName === 'შენ' 
            ? 'bg-yellow-400/90 text-black border-2 border-yellow-300 shadow-lg' 
            : 'bg-white/90 text-black'
        }`}>
          {bidderName}
        </div>

        {/* Victory Crown */}
        {isVictorious && bidderName === 'შენ' && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
            👑
          </div>
        )}

        {/* Explosion Warning */}
        {isExploding && (
          <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50"></div>
        )}
      </div>
    </div>
  );
};
