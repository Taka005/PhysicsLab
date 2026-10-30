import { BaseGround, Circle, Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useEffect } from "react";
import { useEditState } from "@/context/EditContext";

export function useEditMode(engine: Engine | null) {
  const { editConfig, selectedObjectId, setSelectedObjectId, updateEditConfig, setSelectedObjectType } = useEditState();

  useEffect(() => {
    if (!selectedObjectId||!engine) return;

    const object = engine.getObject(selectedObjectId);
    if(!object){
      setSelectedObjectId(null);
      setSelectedObjectType(null);
    }else{
      object.resource.color = editConfig.color ?? "#ff0000";
      object.scriptId = editConfig.scriptId ?? null;

      if(object instanceof Circle){
        object.stiffness = editConfig.stiffness ?? 0.8;
        object.diameter = editConfig.diameter ?? 15;
      }else if(object instanceof BaseGround){
        object.width = editConfig.width ?? 10;
      }
    }
  }, [engine,editConfig, selectedObjectId]);

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point),true);

    const objects = [...engine.getBodiesAt(target),...engine.getGroundsAt(target)];

    if(objects.length > 0){
      const object = objects[0];

      setSelectedObjectId(object.id);
      setSelectedObjectType(object.type);

      if(object instanceof Circle){
        updateEditConfig({
          color: object.resource.color,
          stiffness: object.stiffness,
          diameter: object.diameter,
          scriptId: object.scriptId
        });
      }else if(object instanceof BaseGround){
        updateEditConfig({
          color: object.resource.color,
          width: object.width,
          scriptId: object.scriptId
        });
      }
    }else{
      setSelectedObjectId(null);
      setSelectedObjectType(null);
    }
  },[engine, selectedObjectId, editConfig]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {}
  };
}