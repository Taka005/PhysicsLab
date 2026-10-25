import { Engine, Entity, Vector } from "@/lib/engine";
import { Point } from "../useCanvasInteraction";
import { useCallback, useState } from "react";
import { ConnectionConfig } from "@/context/ConnectionContext";
import { toast } from "sonner";

export function useConnectMode(engine: Engine | null,connectionConfig: ConnectionConfig) {
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

        if(entity.connection.get(selectedEntity.id)){
          setSelectedEntity(null);
          toast.error("既に接続が存在します");

          return;
        }

        if(connectionConfig.type == "static"){
          const distance = Vector.distance(selectedEntity.position,entity.position);

          selectedEntity.connection.add(entity.id,distance,connectionConfig.stiffness);
          entity.connection.add(selectedEntity.id,distance,connectionConfig.stiffness);
        }else if(connectionConfig.type == "dynamic"){
          const distance = entity.radius + selectedEntity.radius;

          selectedEntity.connection.add(entity.id,distance,connectionConfig.stiffness);
          entity.connection.add(selectedEntity.id,distance,connectionConfig.stiffness);
        }

        toast.success("接続しました");

        setSelectedEntity(null);
      }
    }
  },[engine, selectedEntity, connectionConfig]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {}
  };
}