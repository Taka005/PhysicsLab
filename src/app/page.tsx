import PhysicsCanvas from "@/components/PhysicsCanvas";
import { EngineProvider } from "@/context/EngineContext";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <EngineProvider>
        <PhysicsCanvas/>
      </EngineProvider>
    </main>
  );
}
