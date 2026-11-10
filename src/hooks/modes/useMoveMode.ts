import { Booster, Curve, Engine, Entity, Line, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useState } from "react";
import { EffectEdgeData, GroundEdgeData } from "@/lib/engine/types";

export function useMoveMode(engine: Engine | null) {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>();
  const [selectedGroundEdge, setSelectedGroundEdge] = useState<GroundEdgeData | null>();
  const [selectedEffectEdge, setSelectedEffectEdge] = useState<EffectEdgeData | null>();

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point), true);

    const entities = engine.getEntitiesAt(target);
    const groundEdges = engine.getGroundsEdgeAt(target);
    const effectEdges = engine.getEffectsEdgeAt(target);

    if (entities.length > 0) {
      setSelectedEntity(entities[0]);
    } else if (groundEdges.length > 0) {
      setSelectedGroundEdge(groundEdges[0]);
    } else if (effectEdges.length > 0) {
      setSelectedEffectEdge(effectEdges[0]);
    }
  }, [engine]);

  const onMove = useCallback((point: Point, isDragging: boolean) => {
    if (!isDragging || !engine) return;

    const target = engine.toWorldPosition(Vector.from(point));

    if (selectedEntity != null) {
      if(engine.isStarted){
        selectedEntity.velocity = new Vector(0, 0);
      }

      selectedEntity.position = target;
    } else if (selectedGroundEdge != null) {
      if (selectedGroundEdge.ground instanceof Line) {
        if (selectedGroundEdge.type == "start") {
          selectedGroundEdge.ground.start = target;
        } else if (selectedGroundEdge.type == "end") {
          selectedGroundEdge.ground.end = target;
        }
      } else if (selectedGroundEdge.ground instanceof Curve) {
        if (selectedGroundEdge.type == "start") {
          selectedGroundEdge.ground.start = target;
        } else if (selectedGroundEdge.type == "middle") {
          selectedGroundEdge.ground.middle = target;
        } else if (selectedGroundEdge.type == "end") {
          selectedGroundEdge.ground.end = target;
        }
      }
    } else if (selectedEffectEdge != null) {
      if (selectedEffectEdge.effect instanceof Booster) {
        if (selectedEffectEdge.type == "start") {
          selectedEffectEdge.effect.start = target;
        } else if (selectedEffectEdge.type == "end") {
          selectedEffectEdge.effect.end = target;
        }
      }
    }
  }, [engine, selectedEntity, selectedGroundEdge, selectedEffectEdge]);

  const onUp = useCallback(() => {
    setSelectedEntity(null);
    setSelectedGroundEdge(null);
    setSelectedEffectEdge(null);
  }, []);

  return {
    onDown,
    onMove,
    onUp
  };
}