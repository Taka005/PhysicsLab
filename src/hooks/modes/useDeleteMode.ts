import { Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";

export function useDeleteMode(engine: Engine | null) {
  return {
    onDown: (point: Point) => {
      if (!engine) return;

      const target = engine.toWorldPosition(Vector.from(point),true);

      const bodies = engine.getBodiesAt(target);
      const grounds = engine.getGroundsAt(target);

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        engine.deSpawn(body.id);
      }

      for (let i = 0; i < grounds.length; i++) {
        const ground = grounds[i];

        engine.deSpawn(ground.id);
      }
    },
    onMove: () => {},
    onUp: () => {}
  };
}