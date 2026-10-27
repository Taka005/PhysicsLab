"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type EditConfig = {
  color?: string;
  diameter?: number;
  mass?: number;
  stiffness?: number;
  width?: number;
  velocityX?: number;
  velocityY?: number;
};

type EditContextType = {
  editConfig: EditConfig;
  updateEditConfig: (newConfig: Partial<EditConfig>) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  selectedObjectType: string | null;
  setSelectedObjectType: (type: string | null) => void;
};

const EditContext = createContext<EditContextType | undefined>(undefined);

export function EditProvider({ children }: { children: ReactNode }) {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<EditConfig>({});

  const updateEditConfig = (newConfig: Partial<EditConfig>) => {
    setEditConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <EditContext.Provider value={{ editConfig, updateEditConfig, selectedObjectId, setSelectedObjectId, selectedObjectType, setSelectedObjectType }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEditState() {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEditStateはeditProvider内で使用する必要があります");
  }

  return context;
}