import ControlPanel from "@/components/ControlPanel";
import PhysicsCanvas from "@/components/PhysicsCanvas";
import { EngineProvider } from "@/context/EngineContext";
import { SpawnProvider } from "@/context/SpawnContext";
import { ToolModeProvider } from "@/context/ToolModeContext";
import { ConnectionProvider } from "@/context/ConnectionContext";

export default function Home() {
  return (
    <main className="flex h-screen w-screen p-4 gap-4 overflow-hidden bg-gray-100 box-border">
      <EngineProvider>
        <ToolModeProvider>
          <SpawnProvider>
            <ConnectionProvider>
              <PhysicsCanvas/>
              <ControlPanel/>
            </ConnectionProvider>
          </SpawnProvider>
        </ToolModeProvider>
      </EngineProvider>
    </main>
  );
}
