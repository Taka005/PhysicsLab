import { BaseObject, Engine, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useState } from "react";
import { EditConfig } from "@/context/EditContext";

export function useEditMode(engine: Engine | null,editConfig: EditConfig) {
  const [selectedObject, setSelectedObject] = useState<BaseObject | null>();

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point),true);

    const objects = [...engine.getBodiesAt(target),...engine.getGroundsAt(target)];

    if(objects.length > 0){
      const object = objects[0];

      setSelectedObject(object);
    }
  },[engine, selectedObject, editConfig]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {}
  };
}