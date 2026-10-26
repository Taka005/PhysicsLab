"use client";

import { BaseObject } from "@/lib/engine";
import { createContext, useContext, useState, ReactNode } from "react";

export type EditConfig = {
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
  selectedObject: BaseObject | null;
  setSelectedObject: (obj: BaseObject | null) => void;
};

const EditContext = createContext<EditContextType | undefined>(undefined);

export function EditProvider({ children }: { children: ReactNode }) {
  const [selectedObject, setSelectedObject] = useState<BaseObject | null>(null);
  const [editConfig, setEditConfig] = useState<EditConfig>({
    diameter: 15,
    mass: 10,
    stiffness: 0.8,
    width: 10,
    velocityX: 0,
    velocityY: 0
  });

  const updateEditConfig = (newConfig: Partial<EditConfig>) => {
    setEditConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <EditContext.Provider value={{ editConfig, updateEditConfig, selectedObject, setSelectedObject }}>
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