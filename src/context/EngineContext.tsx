"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Engine } from "@/lib/engine";

interface EngineContextType {
  engine: Engine | null;
}

const EngineContext = createContext<EngineContextType>({ engine: null });

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<Engine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const engine = new Engine(
      {
        playBackSpeed: 1,
        trackingInterval: 1000,
        trackingLimit: 100,
        worldSize: 5000,
        pps: 120,
        gravity: 100,
        friction: 0.001,
      },
      {
        offset: { x: 0, y: 0 },
        zoomRatio: 1,
      }
    );

    engineRef.current = engine;
    setIsInitialized(true);

    return () => {
      engineRef.current = null;
      setIsInitialized(false);
    };
  }, []);

  return (
    <EngineContext.Provider value={{ engine: engineRef.current }}>
      {isInitialized && children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error("useEngineはEngineProvider内で使用する必要があります");
  }

  return context.engine;
}