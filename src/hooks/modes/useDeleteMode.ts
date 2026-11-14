import { Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useRef, useState } from "react";

export interface DeleteSelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function getSelectionRect(start: Point, end: Point): DeleteSelectionRect {
  return {
    left: Math.min(start.x, end.x),
    top: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y)
  };
}

export function useDeleteMode(engine: Engine | null) {
  const [selectionRect, setSelectionRect] = useState<DeleteSelectionRect | null>(null);
  const selectionStart = useRef<Point | null>(null);

  const deleteAtPoint = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point), true);
    const bodies = engine.getBodiesAt(target);
    const grounds = engine.getGroundsAt(target);
    const effects = engine.getEffectsAt(target);

    for (const object of [...bodies, ...grounds, ...effects]) {
      engine.deSpawn(object.id);
    }
  },[engine]);

  const onDown = useCallback((point: Point) => {
    selectionStart.current = point;
    setSelectionRect(getSelectionRect(point, point));
  }, []);

  const onMove = useCallback((point: Point, isDragging: boolean) => {
    if (!isDragging || !selectionStart.current) return;

    setSelectionRect(getSelectionRect(selectionStart.current, point));
  }, []);

  const onUp = useCallback((point: Point) => {
    const start = selectionStart.current;
    selectionStart.current = null;
    setSelectionRect(null);

    if (!start) return;

    const end = point ?? start;

    if (Math.hypot(end.x - start.x, end.y - start.y) < 3) {
      deleteAtPoint(end);
      return;
    }

    if (!engine) return;

    const worldStart = engine.toWorldPosition(Vector.from(start), true);
    const worldEnd = engine.toWorldPosition(Vector.from(end),true);
    const objects = [
      ...engine.getBodiesInRect(worldStart, worldEnd),
      ...engine.getGroundsInRect(worldStart, worldEnd),
      ...engine.getEffectsInRect(worldStart, worldEnd)
    ];

    for (const object of objects) {
      engine.deSpawn(object.id);
    }
  }, [deleteAtPoint, engine]);

  return {
    selectionRect,
    onDown,
    onMove,
    onUp
  };
}