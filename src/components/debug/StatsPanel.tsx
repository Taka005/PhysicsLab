"use client";

import type { RefObject } from "react";
import type { Point } from "@/hooks/useCanvasInteraction";
import type { EngineSnapShot, VectorData } from "@/lib/engine/types";

type StatsPanelProps = {
  fpsRef: RefObject<HTMLSpanElement | null>;
  currentPoint: Point | null;
  worldPoint: VectorData | null;
  counts: Pick<EngineSnapShot, "bodiesCount" | "groundsCount" | "effectsCount" | "entitiesCount">;
};

export default function StatsPanel({
  fpsRef,
  currentPoint,
  worldPoint,
  counts
}: StatsPanelProps) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 select-none">
      <div className="min-w-52 rounded-xl border border-gray-200/80 bg-white/80 px-3 py-2.5 shadow-lg backdrop-blur-sm">
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
            {counts.bodiesCount}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-xs text-gray-700">
            Grounds
          </span>
          <span className="font-mono text-xs tabular-nums text-gray-700">
            {counts.groundsCount}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-xs text-gray-700">
            Effects
          </span>
          <span className="font-mono text-xs tabular-nums text-gray-700">
            {counts.effectsCount}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-xs text-gray-700">
            Entities
          </span>
          <span className="font-mono text-xs tabular-nums text-gray-700">
            {counts.entitiesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
