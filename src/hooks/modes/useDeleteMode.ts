import { Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback } from "react";

export function useDeleteMode(engine: Engine | null) {
  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point),true);

    const bodies = engine.getBodiesAt(target);
    const grounds = engine.getGroundsAt(target);
    const effects = engine.getEffectsAt(target);

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];

      engine.deSpawn(body.id);
    }

    for (let i = 0; i < grounds.length; i++) {
      const ground = grounds[i];

      engine.deSpawn(ground.id);
    }

    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];

      engine.deSpawn(effect.id);
    }
  },[engine]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {}
  };
}