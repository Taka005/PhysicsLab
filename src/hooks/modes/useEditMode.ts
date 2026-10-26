import { BaseBody, Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useEffect } from "react";
import { useEditState } from "@/context/EditContext";

export function useEditMode(engine: Engine | null) {
  const { editConfig, selectedObject, setSelectedObject, updateEditConfig } = useEditState();

  useEffect(() => {
    if (!selectedObject) return;

    if(selectedObject instanceof BaseBody){
      selectedObject.stiffness = editConfig.stiffness ?? 0;
    }
  }, [editConfig, selectedObject]);

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point),true);

    const objects = [...engine.getBodiesAt(target),...engine.getGroundsAt(target)];

    if(objects.length > 0){
      const object = objects[0];

      setSelectedObject(object);

      if(object instanceof BaseBody){
        updateEditConfig({
          stiffness: object.stiffness
        });
      }
    }else{
      setSelectedObject(null);
    }
  },[engine, selectedObject, editConfig]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {}
  };
}