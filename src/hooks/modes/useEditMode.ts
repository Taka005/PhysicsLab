import { BaseBody, Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useEffect } from "react";
import { useEditState } from "@/context/EditContext";

export function useEditMode(engine: Engine | null) {
  const { editConfig, selectedObjectId, setSelectedObjectId, updateEditConfig, selectedObjectType, setSelectedObjectType } = useEditState();

  useEffect(() => {
    if (!selectedObjectId||!engine) return;

    const object = engine.getObject(selectedObjectId);
    if(!object){
      setSelectedObjectId(null);
      setSelectedObjectType(null);
    }else{
      if(object instanceof BaseBody){
        object.stiffness = editConfig.stiffness ?? 0;
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

      if(object instanceof BaseBody){
        updateEditConfig({
          stiffness: object.stiffness
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