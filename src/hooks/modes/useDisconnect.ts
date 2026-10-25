import { Engine, Entity, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useDisconnectMode(engine: Engine | null) {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>();

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    const target = engine.toWorldPosition(Vector.from(point),true);

    const entities = engine.getEntitiesAt(target);

    if(entities.length > 0){
      const entity = entities[0];

      if(selectedEntity == null){
        setSelectedEntity(entity);
      }else{
        if (selectedEntity.id === entity.id) return;

        if(!entity.connection.get(selectedEntity.id)){
          setSelectedEntity(null);
          toast.error("接続が存在しません");

          return;
        }

        selectedEntity.connection.remove(entity.id);
        entity.connection.remove(selectedEntity.id);

        toast.success("切断しました");

        setSelectedEntity(null);
      }
    }
  },[engine, selectedEntity]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {}
  };
}