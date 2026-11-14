import { Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface SelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function getSelectionRect(start: Point, end: Point): SelectionRect {
  return {
    left: Math.min(start.x, end.x),
    top: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y)
  };
}

export function useGroupMode(engine: Engine | null) {
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const selectionStart = useRef<Point | null>(null);

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

    if (!start || !engine || Math.hypot(point.x - start.x, point.y - start.y) < 3) return;

    const worldStart = engine.toWorldPosition(Vector.from(start), true);
    const worldEnd = engine.toWorldPosition(Vector.from(point), true);
    const entities = engine.getEntitiesInRect(worldStart, worldEnd);

    if (entities.length === 0) {
      toast.error("範囲内にエンティティーがありません");
      return;
    }

    engine.setVelocityDampingGroup(entities);
    toast.success(`${entities.length}個のエンティティーをグループ化しました`);
  }, [engine]);

  return {
    selectionRect,
    onDown,
    onMove,
    onUp
  };
}
