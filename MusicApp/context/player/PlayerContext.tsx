import React, { createContext, useState, useContext, ReactNode } from 'react';

// Defina o tipo para o contexto
type PlayerContextType = {
  isMinimized: boolean;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  minimizePlayer: () => void;
  expandPlayer: () => void;
};

// Defina o tipo para uma "Track" (faixa de música)
type Track = {
  title: string;
  artist: string;
};

// Crie o contexto com o tipo ou `undefined` como inicial
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

type PlayerProviderProps = {
  children: ReactNode;
};

// Provider para gerenciar o estado do player
export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const minimizePlayer = () => setIsMinimized(true);
  const expandPlayer = () => setIsMinimized(false);

  return (
    <PlayerContext.Provider
      value={{
        isMinimized,
        currentTrack,
        setCurrentTrack,
        minimizePlayer,
        expandPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// Hook para acessar o contexto
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
