import { Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";

export function useMoveMode(engine: Engine | null) {
  let position = new Vector(0,0);

  return {
    onDown: (point: Point) => {
      position = Vector.from(point);
    },
    onMove: (point: Point, isDragging: boolean) => {
      if (!isDragging || !engine) return;

    },
    onUp: () => {},
  };
}