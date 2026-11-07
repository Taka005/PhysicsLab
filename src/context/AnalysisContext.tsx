"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AnalysisContextValue = {
  selectedBodyId: string | null;
  setSelectedBodyId: (id: string | null) => void;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider value={{ selectedBodyId, setSelectedBodyId }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
