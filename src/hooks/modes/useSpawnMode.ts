import { useState, useEffect, useCallback } from "react";
import { Engine, Vector } from "@/lib/engine";
import { CircleCreateOption, CurveCreateOption, LineCreateOption } from "@/lib/engine/types";
import { SpawnConfig } from "@/context/SpawnContext";
import { Point } from "../useCanvasInteraction";

export function useSpawnMode(engine: Engine | null, spawnConfig: SpawnConfig) {
  const [clickedPoints, setClickedPoints] = useState<Point[]>([]);

  useEffect(() => {
    setClickedPoints([]);
  }, [spawnConfig.type]);

  const getRequiredPointsCount = (type: string) => {
    switch (type) {
      case "circle": return 1;
      case "line": return 2;
      case "curve": return 3;
      default: return 1;
    }
  };

  const requiredCount = getRequiredPointsCount(spawnConfig.type);

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const nextPoints = [...clickedPoints, engine.toWorldPosition(Vector.from(point))];

    if (nextPoints.length >= requiredCount) {
      if (spawnConfig.type === "circle") {
        engine.spawn({
          type: "circle",
          id: `ball_${Date.now()}`,
          position: { x: nextPoints[0].x, y: nextPoints[0].y },
          velocity: { x: spawnConfig.velocityX, y: spawnConfig.velocityY },
          diameter: spawnConfig.diameter,
          mass: spawnConfig.mass,
          stiffness: spawnConfig.stiffness
        } as CircleCreateOption);
      } else if (spawnConfig.type === "line") {
        engine.spawn({
          type: "line",
          id: `line_${Date.now()}`,
          start: { x: nextPoints[0].x, y: nextPoints[0].y },
          end: { x: nextPoints[1].x, y: nextPoints[1].y },
          width: spawnConfig.width
        } as LineCreateOption);
      } else if (spawnConfig.type === "curve") {
        engine.spawn({
          type: "curve",
          id: `curve_${Date.now()}`,
          start: { x: nextPoints[0].x, y: nextPoints[0].y },
          middle: { x: nextPoints[1].x, y: nextPoints[1].y },
          end: { x: nextPoints[2].x, y: nextPoints[2].y },
          width: spawnConfig.width
        } as CurveCreateOption);
      }

      setClickedPoints([]);
    } else {
      setClickedPoints(nextPoints);
    }
  }, [engine, clickedPoints, requiredCount, spawnConfig]);

  const onMove = useCallback((point: Point, isDragging: boolean) => {
  }, []);

  const onUp = useCallback(() => {
  }, []);

  return {
    onDown,
    onMove,
    onUp,
  };
}