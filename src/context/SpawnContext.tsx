"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type SpawnConfig = {
  diameter: number;
  mass: number;
  stiffness: number;
};

type SpawnContextType = {
  spawnConfig: SpawnConfig;
  updateSpawnConfig: (newConfig: Partial<SpawnConfig>) => void;
};

const SpawnContext = createContext<SpawnContextType | undefined>(undefined);

export function SpawnProvider({ children }: { children: ReactNode }) {
  const [spawnConfig, setSpawnConfig] = useState<SpawnConfig>({
    diameter: 15,
    mass: 10,
    stiffness: 0.8,
  });

  const updateSpawnConfig = (newConfig: Partial<SpawnConfig>) => {
    setSpawnConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <SpawnContext.Provider value={{ spawnConfig, updateSpawnConfig }}>
      {children}
    </SpawnContext.Provider>
  );
}

export function useSpawnState() {
  const context = useContext(SpawnContext);
  if (!context) {
    throw new Error("useSpawnStateはSpawnProvider内で使用する必要があります");
  }

  return context;
}