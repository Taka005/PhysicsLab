"use client";

import { useEffect, useRef } from "react";
import { Renderer } from "@/lib/render";
import { useEngine } from "@/context/EngineContext";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useSpawnState } from "@/context/SpawnContext";
import { useViewportControl } from "@/hooks/useViewportControl";
import { useToolMode } from "@/context/ToolModeContext";
import { useSpawnMode } from "@/hooks/modes/useSpawnMode";

export default function PhysicsCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useEngine();
  const { spawnConfig } = useSpawnState();
  const { handleWheel } = useViewportControl(engine);
  const spawnMode = useSpawnMode(engine, spawnConfig);
  const { mode } = useToolMode();

  const activeMode = (() => {
    switch (mode) {
      case "spawn": return spawnMode;
      default: return spawnMode;
    }
  })();

  const { handlers } = useCanvasInteraction({
    canvasRef,
    onDown: (point) => activeMode.onDown(point),
    onMove: (point, isDragging) => activeMode.onMove(point, isDragging),
    onUp: (point) => activeMode.onUp(),
    onWheel: (e) => handleWheel(e),
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !engine) return;

    const renderer = new Renderer(engine);

    let animationFrameId: number;

    const initPixi = async () => {
     const { clientWidth, clientHeight } = containerRef.current!;

      await renderer.init(
        canvasRef.current!,
        clientWidth,
        clientHeight
      );

      engine.import(`{"engine":{"playBackSpeed":1,"trackingInterval":300,"trackingLimit":100,"worldSize":5000,"pps":120,"gravity":200,"friction":0.001},"viewport":{"offset":{"x":0,"y":0},"zoomRatio":1, "gridWidth":50},"objects":{"bodies":[{"type":"circle","id":"ball1","trackingId":"cNYbhzO2hV","diameter":10,"entities":[{"id":"ball1","position":{"x":50,"y":50},"velocity":{"x":50,"y":50},"diameter":10,"mass":10,"stiffness":0.8,"connections":[]}]},{"type":"circle","id":"ball2","trackingId":"FqEhU4FmN5","diameter":20,"entities":[{"id":"ball2","position":{"x":60,"y":30},"velocity":{"x":50,"y":50},"diameter":20,"mass":10,"stiffness":0.8,"connections":[]}]}],"grounds":[{"type":"line","id":"line1","width":10,"start":{"x":0,"y":100},"end":{"x":200,"y":200}},{"type":"line","id":"line2","width":10,"start":{"x":200,"y":200},"end":{"x":500,"y":200}}]}}`)

      const loop = () => {
        renderer.render();

        animationFrameId = requestAnimationFrame(loop);
      };

      loop();
    };

    initPixi();

    const handleResize = () => {
      if (containerRef.current && renderer) {
        const { clientWidth, clientHeight } = containerRef.current;

        renderer.resize(clientWidth,clientHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.destroy();
    };
  }, [engine]);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full relative bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full" {...handlers}/>
    </div>
  );
}