"use client";

import { useEffect, useRef } from "react";
import { Renderer } from "@/lib/render";
import { useEngine } from "@/context/EngineContext";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useViewportControl } from "@/hooks/useViewportControl";
import { useToolMode } from "@/context/ToolModeContext";
import { useSpawnMode } from "@/hooks/modes/useSpawnMode";
import { useMoveMode } from "@/hooks/modes/useMoveMode";
import { useDeleteMode } from "@/hooks/modes/useDeleteMode";
import { useConnectMode } from "@/hooks/modes/useConnectMode";
import { useDisconnectMode } from "@/hooks/modes/useDisconnect";
import { useEditMode } from "@/hooks/modes/useEditMode";
import { Vector } from "@/lib/engine";
import { useEngineState } from "@/hooks/useEngineState";

export default function PhysicsCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fpsRef = useRef<HTMLSpanElement | null>(null);
  const engine = useEngine();
  const state = useEngineState();
  const { handleWheel } = useViewportControl(engine);
  const spawnMode = useSpawnMode(engine);
  const moveMode = useMoveMode(engine);
  const deleteMode = useDeleteMode(engine);
  const editMode = useEditMode(engine);
  const connectMode = useConnectMode(engine);
  const disconnectMode = useDisconnectMode(engine);
  const { mode } = useToolMode();

  if(!engine) return;

  const activeMode = (() => {
    switch (mode) {
      case "spawn": return spawnMode;
      case "move": return moveMode;
      case "delete": return deleteMode;
      case "edit": return editMode;
      case "connect": return connectMode;
      case "disconnect": return disconnectMode;
      default: return spawnMode;
    }
  })();

  const { currentPoint, handlers } = useCanvasInteraction({
    canvasRef,
    onDown: (point) => activeMode.onDown(point),
    onMove: (point, isDragging) => activeMode.onMove(point, isDragging),
    onUp: () => activeMode.onUp(),
    onWheel: (e) => handleWheel(e),
  });

  const worldPoint = currentPoint !== null ? engine.toWorldPosition(Vector.from(currentPoint)) : null;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !engine) return;

    const renderer = new Renderer(engine);

    let animationFrameId: number;
    let previousFpsTime = performance.now();
    let frameCount = 0;

    const initPixi = async () => {
     const { clientWidth, clientHeight } = containerRef.current!;

      await renderer.init(
        canvasRef.current!,
        clientWidth,
        clientHeight
      );

      engine.import(`{"version": 1,"engine":{"playBackSpeed":1,"trackingInterval":100,"trackingLimit":100,"scriptExecuteInterval":100,"worldSize":5000,"pps":120,"gravity":250,"friction":0.001},"viewport":{"offset":{"x":0,"y":0},"zoomRatio":1,"gridWidth":50},"scripts":[{"id":"tCDqlW5HxW","name":"円運動","code":"init {\\nt = 0;\\n}\\n\\nupdate {\\nobj.end.x = obj.start.x + 50*cos(PI*t);\\nobj.end.y = obj.start.y + 50*sin(PI*t);\\nt += 0.03;\\n}"}],"objects":{"bodies":[{"type":"circle","id":"fWq41bsePK","resource":{"color":"#ff0000"},"diameter":15,"scriptId":null,"entities":[{"id":"HyQp8g09Yl","position":{"x":196,"y":284},"velocity":{"x":0,"y":0},"diameter":15,"mass":10,"stiffness":0.8,"connections":[]}]},{"type":"circle","id":"rK7zdA5NvE","resource":{"color":"#ff0000"},"diameter":15,"scriptId":null,"entities":[{"id":"5E4Vq9B3sf","position":{"x":382,"y":503},"velocity":{"x":0,"y":0},"diameter":15,"mass":10,"stiffness":0.8,"connections":[]}]}],"grounds":[{"type":"line","id":"line_1792994591683","resource":{"color":"#ff0000"},"width":10,"start":{"x":50,"y":550},"end":{"x":700,"y":550},"scriptId":null},{"type":"curve","id":"curve_1792994611867","resource":{"color":"#ff0000"},"width":10,"start":{"x":300,"y":550},"middle":{"x":200,"y":500},"end":{"x":150,"y":400},"scriptId":null},{"type":"line","id":"E1Icm85IS8","resource":{"color":"#ff0000"},"width":10,"start":{"x":625,"y":502},"end":{"x":672.5528258147572,"y":486.549150281251},"scriptId":"tCDqlW5HxW"}]}}`);

      const loop = () => {
        renderer.render();

        frameCount++;

        const currentTime = performance.now();
        const elapsedTime = currentTime - previousFpsTime;

        if (elapsedTime >= 500) {
          const fps = (frameCount * 1000) / elapsedTime;

          if (fpsRef.current) {
            fpsRef.current.textContent = fps.toFixed(1);
          }

          frameCount = 0;
          previousFpsTime = currentTime;
        }

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
      {state.isDebugMode && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 z-10 select-none">
            <div className="min-w-52 rounded-xl border border-gray-200/80 bg-white/90 px-3 py-2.5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-gray-700">
                    FPS
                  </span>
                </div>
                <span
                  ref={fpsRef}
                  className="font-mono text-sm font-semibold tabular-nums text-gray-800"
                >
                  --
                </span>
              </div>
              <div className="my-2 border-t border-gray-100" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-700">
                  Screen
                </span>
                <span className="font-mono text-xs tabular-nums text-gray-700">
                  {currentPoint ? `(${currentPoint.x.toFixed(1)}, ${currentPoint.y.toFixed(1)})` : "—"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-gray-700">
                  World
                </span>
                <span className="font-mono text-xs tabular-nums text-gray-700">
                  {worldPoint ? `(${worldPoint.x.toFixed(1)}, ${worldPoint.y.toFixed(1)})` : "—"}
                </span>
              </div>
              <div className="my-2 border-t border-gray-100" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-700">
                  Bodies
                </span>
                <span className="font-mono text-xs tabular-nums text-gray-700">
                  {state.bodiesCount}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-gray-700">
                  Grounds
                </span>
                <span className="font-mono text-xs tabular-nums text-gray-700">
                  {state.groundsCount}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-gray-700">
                  Entities
                </span>
                <span className="font-mono text-xs tabular-nums text-gray-700">
                  {state.entitiesCount}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}