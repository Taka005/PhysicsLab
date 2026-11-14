"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Draggable from "react-draggable";
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
import { useFillMode } from "@/hooks/modes/useFillMode";
import { useGroupMode } from "@/hooks/modes/useGroupMode";
import { useUngroupMode } from "@/hooks/modes/useUngroupMode";
import { BaseBody, Vector } from "@/lib/engine";
import { useEngineState } from "@/hooks/useEngineState";
import { useProtractor } from "@/context/ProtractorContext";
import ProtractorOverlay from "./ProtractorOverlay";
import StatsPanel from "./debug/StatsPanel";
import ObjectInfo from "./debug/ObjectInfo";
import { useAnalysis } from "@/context/AnalysisContext";
import { useCanvasExport } from "@/context/CanvasExportContext";
import GraphPanel from "./analysis/GraphPanel";
import { toast } from "sonner";

type BodyContextMenu = {
  bodyId: string;
  x: number;
  y: number;
};

export default function PhysicsCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fpsRef = useRef<HTMLSpanElement | null>(null);
  const analysisPanelRef = useRef<HTMLDivElement | null>(null);
  const [bodyContextMenu, setBodyContextMenu] = useState<BodyContextMenu | null>(null);
  const engine = useEngine();
  const state = useEngineState();
  const { handleWheel } = useViewportControl(engine);
  const spawnMode = useSpawnMode(engine);
  const fillMode = useFillMode(engine);
  const moveMode = useMoveMode(engine);
  const deleteMode = useDeleteMode(engine);
  const editMode = useEditMode(engine);
  const connectMode = useConnectMode(engine);
  const disconnectMode = useDisconnectMode(engine);
  const groupMode = useGroupMode(engine);
  const ungroupMode = useUngroupMode(engine);
  const { mode } = useToolMode();
  const { isProtractorVisible } = useProtractor();
  const { selectedBodyId, setSelectedBodyId } = useAnalysis();
  const { setExporter, setGifRecorder } = useCanvasExport();

  if(!engine) return;

  const activeMode = (() => {
    switch (mode) {
      case "spawn": return spawnMode;
      case "fill": return fillMode;
      case "move": return moveMode;
      case "delete": return deleteMode;
      case "edit": return editMode;
      case "connect": return connectMode;
      case "disconnect": return disconnectMode;
      case "group": return groupMode;
      case "ungroup": return ungroupMode;
      default: return spawnMode;
    }
  })();

  const selectionRect = mode === "delete"
    ? deleteMode.selectionRect
    : mode === "group"
      ? groupMode.selectionRect
      : mode === "ungroup"
        ? ungroupMode.selectionRect
        : null;

  const { currentPoint, handlers } = useCanvasInteraction({
    canvasRef,
    onDown: (point) => activeMode.onDown(point),
    onMove: (point, isDragging) => activeMode.onMove(point, isDragging),
    onUp: (point) => activeMode.onUp(point),
    onWheel: (e) => handleWheel(e),
  });

  const worldPoint = currentPoint !== null ? engine.toWorldPosition(Vector.from(currentPoint)) : null;

  const hoveredBodies = state.isDebugMode && worldPoint !== null ? engine.getBodiesAt(worldPoint) : [];

  const hoveredGrounds = state.isDebugMode && worldPoint !== null ? engine.getGroundsAt(worldPoint) : [];

  const cursorInfoPosition = currentPoint !== null && containerRef.current !== null
    ? {
        left: Math.max(
          8,
          Math.min(
            currentPoint.x + 16,
            containerRef.current.clientWidth - 300
          )
        ),
        top: Math.max(
          8,
          Math.min(
            currentPoint.y + 16,
            containerRef.current.clientHeight - 240
          )
        )
      }
    : null;

  const handleCanvasContextMenu = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const worldPosition = engine.toWorldPosition(Vector.from(point), true);
    const body = engine.getBodiesAt(worldPosition)[0];

    if (!body) {
      setBodyContextMenu(null);
      return;
    }

    const menuHeight = mode === "move" && body.entities.some(entity => entity.connection.targetCount > 0) ? 88 : 48;

    setBodyContextMenu({
      bodyId: body.id,
      x: Math.max(8, Math.min(point.x, container.clientWidth - 132)),
      y: Math.max(8, Math.min(point.y, container.clientHeight - menuHeight))
    });
  };

  const analyzedBody = selectedBodyId ? engine.getObject(selectedBodyId) : undefined;
  const contextMenuBody = bodyContextMenu ? engine.getObject(bodyContextMenu.bodyId) : undefined;
  const canChangeConnections = mode === "move" && contextMenuBody instanceof BaseBody && contextMenuBody.entities.some(entity => entity.connection.targetCount > 0);

  const handleChangeConnections = () => {
    if (!(contextMenuBody instanceof BaseBody)) return;

    for (const entity of contextMenuBody.entities) {
      for (const target of entity.connection.targets) {
        const connectedEntity = engine.getEntity(target.entityId);
        if (!connectedEntity) continue;

        const distance = Vector.distance(entity.position, connectedEntity.position);
        entity.connection.setDistance(connectedEntity.id, distance);

        if (connectedEntity.connection.get(entity.id)) {
          connectedEntity.connection.setDistance(entity.id, distance);
        }
      }
    }

    toast.success("接続距離を変更しました");

    setBodyContextMenu(null);
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !engine) return;

    const renderer = new Renderer(engine);
    setExporter(() => () => renderer.exportPng());
    setGifRecorder(() => (signal: AbortSignal) => renderer.recordGif(signal));

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
      setExporter(null);
      setGifRecorder(null);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.destroy();
    };
  }, [engine, setExporter, setGifRecorder]);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full relative bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        {...handlers}
        onClick={() => setBodyContextMenu(null)}
        onContextMenu={handleCanvasContextMenu}
      />
      {(mode === "delete" || mode === "group" || mode === "ungroup") && selectionRect && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 ${
            mode === "delete"
              ? "border border-red-500 bg-red-500/15"
              : mode === "group"
                ? "border border-blue-500 bg-blue-500/15"
                : "border border-amber-500 bg-amber-500/15"
          }`}
          style={{
            left: selectionRect.left,
            top: selectionRect.top,
            width: selectionRect.width,
            height: selectionRect.height
          }}
        />
      )}
      <ProtractorOverlay visible={isProtractorVisible} />
      {bodyContextMenu && (
        <div
          role="menu"
          className="absolute z-30 rounded-md border border-gray-200 bg-white/90 p-1 shadow-lg backdrop-blur-sm"
          style={{ left: bodyContextMenu.x, top: bodyContextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            className="w-full rounded px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => {
              setSelectedBodyId(bodyContextMenu.bodyId);
              setBodyContextMenu(null);
            }}
          >
            分析
          </button>
          {canChangeConnections && (
            <button
              type="button"
              role="menuitem"
              className="w-full rounded px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
              onClick={handleChangeConnections}
            >
              接続を変更
            </button>
          )}
        </div>
      )}
      {analyzedBody instanceof BaseBody && (
        <Draggable
          nodeRef={analysisPanelRef}
          handle=".analysis-handle"
          bounds="parent"
        >
          <div
            ref={analysisPanelRef}
            className="absolute top-10 right-70 w-80 rounded-lg border-white bg-white/80 overflow-hidden z-50 shadow-xl backdrop-blur-md"
          >
            <div className="analysis-handle text-gray-700 px-4 py-2 flex justify-between items-center cursor-move text-sm font-semibold border-b border-gray-200/70">
              <span className="text-sm font-semibold text-gray-800">分析</span>
              <button
                type="button"
                className="cursor-pointer rounded px-2 text-gray-600 hover:bg-gray-200/70 focus:outline-none"
                onClick={() => setSelectedBodyId(null)}
              >
                ✕
              </button>
            </div>
            <GraphPanel
              key={analyzedBody.id}
              engine={engine}
              body={analyzedBody}
            />
          </div>
        </Draggable>
      )}
      {state.isDebugMode && (
        <StatsPanel
          fpsRef={fpsRef}
          currentPoint={currentPoint}
          worldPoint={worldPoint}
          counts={state}
        />
      )}
      {state.isDebugMode &&
      currentPoint !== null &&
      cursorInfoPosition !== null &&
      (hoveredBodies.length > 0 || hoveredGrounds.length > 0) && (
        <ObjectInfo
          bodies={hoveredBodies}
          grounds={hoveredGrounds}
          position={cursorInfoPosition}
        />
      )}
    </div>
  );
}