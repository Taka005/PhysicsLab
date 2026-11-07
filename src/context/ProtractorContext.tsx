"use client";

import { createContext, useContext, useState } from "react";

type ProtractorContextValue = {
  isProtractorVisible: boolean;
  setIsProtractorVisible: (visible: boolean) => void;
};

const ProtractorContext = createContext<ProtractorContextValue | null>(null);

export function ProtractorProvider({ children }: { children: React.ReactNode }) {
  const [isProtractorVisible, setIsProtractorVisible] = useState(false);

  return (
    <ProtractorContext.Provider value={{ isProtractorVisible, setIsProtractorVisible }}>
      {children}
    </ProtractorContext.Provider>
  );
}

export function useProtractor() {
  const context = useContext(ProtractorContext);
  if (!context) {
    throw new Error("useProtractor must be used within a ProtractorProvider");
  }
  return context;
}
