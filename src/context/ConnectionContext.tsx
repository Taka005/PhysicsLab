"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ConnectionConfig = {
  type: string;
  stiffness: number;
};

type ConnectionContextType = {
  connectionConfig: ConnectionConfig;
  updateConnectionConfig: (newConfig: Partial<ConnectionConfig>) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    type: "dynamic",
    stiffness: 0.8
  });

  const updateConnectionConfig = (newConfig: Partial<ConnectionConfig>) => {
    setConnectionConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <ConnectionContext.Provider value={{ connectionConfig, updateConnectionConfig }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionState() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnectionStateはConnectionProvider内で使用する必要があります");
  }

  return context;
}