"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type FillConfig = {
  type: string;
  color: string;
  diameter?: number;
  mass?: number;
  stiffness?: number;
  velocityX?: number;
  velocityY?: number;
  scriptId?: string | null;
};

type FillContextType = {
  fillConfig: FillConfig;
  updateFillConfig: (newConfig: Partial<FillConfig>) => void;
};

const FillContext = createContext<FillContextType | undefined>(undefined);

export function FillProvider({ children }: { children: ReactNode }) {
  const [fillConfig, setFillConfig] = useState<FillConfig>({
    type: "circle",
    color: "#ff0000",
    diameter: 15,
    mass: 10,
    stiffness: 0.8,
    velocityX: 0,
    velocityY: 0,
    scriptId: null
  });

  const updateFillConfig = (newConfig: Partial<FillConfig>) => {
    setFillConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <FillContext.Provider value={{ fillConfig, updateFillConfig }}>
      {children}
    </FillContext.Provider>
  );
}

export function useFillState() {
  const context = useContext(FillContext);
  if (!context) {
    throw new Error("useFillStateはFillProvider内で使用する必要があります");
  }

  return context;
}