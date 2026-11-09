"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type CanvasExporter = () => Promise<Blob>;
type GifRecorder = (signal: AbortSignal) => Promise<Blob>;

type CanvasExportContextValue = {
  exporter: CanvasExporter | null;
  setExporter: Dispatch<SetStateAction<CanvasExporter | null>>;
  gifRecorder: GifRecorder | null;
  setGifRecorder: Dispatch<SetStateAction<GifRecorder | null>>;
};

const CanvasExportContext = createContext<CanvasExportContextValue | null>(null);

export function CanvasExportProvider({ children }: { children: ReactNode }) {
  const [exporter, setExporter] = useState<CanvasExporter | null>(null);
  const [gifRecorder, setGifRecorder] = useState<GifRecorder | null>(null);

  return (
    <CanvasExportContext.Provider value={{ exporter, setExporter, gifRecorder, setGifRecorder }}>
      {children}
    </CanvasExportContext.Provider>
  );
}

export function useCanvasExport() {
  const context = useContext(CanvasExportContext);
  if (!context) {
    throw new Error("useCanvasExportはCanvasExportProvider内で使用する必要があります");
  }

  return context;
}
