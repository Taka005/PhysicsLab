"use client";

import { createContext, useContext, useState } from "react";

const ToolModeContext = createContext<{
  mode: string;
  setMode: (mode: string) => void;
} | null>(null);

export function ToolModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<string>("spawn");

  return (
    <ToolModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ToolModeContext.Provider>
  );
}

export const useToolMode = () => useContext(ToolModeContext)!;