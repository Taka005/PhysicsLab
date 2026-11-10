"use client";

import ControlPanel from "@/components/ControlPanel";
import PhysicsCanvas from "@/components/PhysicsCanvas";
import { EngineProvider } from "@/context/EngineContext";
import { ProtractorProvider } from "@/context/ProtractorContext";
import { SpawnProvider } from "@/context/SpawnContext";
import { ToolModeProvider } from "@/context/ToolModeContext";
import { ConnectionProvider } from "@/context/ConnectionContext";
import { EditProvider } from "@/context/EditContext";
import { FillProvider } from "@/context/FillContext";
import { AnalysisProvider } from "@/context/AnalysisContext";
import { CanvasExportProvider } from "@/context/CanvasExportContext";

export default function Page() {
  return (
    <main className="flex h-screen w-screen p-4 gap-4 overflow-hidden bg-gray-100 box-border">
      <EngineProvider>
        <ToolModeProvider>
          <SpawnProvider>
            <EditProvider>
              <FillProvider>
                <ConnectionProvider>
                  <ProtractorProvider>
                    <AnalysisProvider>
                      <CanvasExportProvider>
                        <PhysicsCanvas/>
                        <ControlPanel/>
                      </CanvasExportProvider>
                    </AnalysisProvider>
                  </ProtractorProvider>
                </ConnectionProvider>
              </FillProvider>
            </EditProvider>
          </SpawnProvider>
        </ToolModeProvider>
      </EngineProvider>
    </main>
  );
}
