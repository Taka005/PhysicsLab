import ControllPanel from "@/components/ControllPanel";
import PhysicsCanvas from "@/components/PhysicsCanvas";
import { EngineProvider } from "@/context/EngineContext";

export default function Home() {
  return (
    <main className="flex h-screen w-screen p-4 gap-4 overflow-hidden bg-gray-100 box-border">
      <EngineProvider>
        <PhysicsCanvas/>
        <ControllPanel/>
      </EngineProvider>
    </main>
  );
}
