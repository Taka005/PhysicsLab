import { useState, useEffect, useCallback } from "react";
import { createId, Engine, EngineError, Vector } from "@/lib/engine";
import { CircleCreateOption } from "@/lib/engine/types";
import { useFillState } from "@/context/FillContext";
import { Point } from "../useCanvasInteraction";
import { toast } from "sonner";

export function useFillMode(engine: Engine | null) {
  const { fillConfig, updateFillConfig } = useFillState();
  const [clickedPoint, setClickedPoint] = useState<Point | null>();

  useEffect(() => {
    setClickedPoint(null);
    updateFillConfig({ scriptId: null});
  }, [fillConfig.type]);

  const onDown = useCallback((point: Point) => {
    if (!engine) return;

    if (clickedPoint != null) {
      try{
        const nextPoint = engine.toWorldPosition(Vector.from(point));

        const startX = Math.min(clickedPoint.x, nextPoint.x);
        const startY = Math.min(clickedPoint.y, nextPoint.y);
        const endX = Math.max(clickedPoint.x, nextPoint.x);
        const endY = Math.max(clickedPoint.y, nextPoint.y);

        const countX = Math.floor(Math.abs(endX - startX) / (fillConfig.diameter ?? 10));
        const countY = Math.floor(Math.abs(endY - startY) / (fillConfig.diameter ?? 10));

        if (fillConfig.type === "circle") {
          for (let i = 0; i <= countX; i++){
            for (let j = 0; j <= countY; j++){
              engine.spawn({
                type: "circle",
                id: createId(10),
                resource:{
                  color: fillConfig.color
                },
                position: { x: startX + i*(fillConfig.diameter ?? 10), y: startY + j*(fillConfig.diameter ?? 10) },
                velocity: { x: fillConfig.velocityX, y: fillConfig.velocityY },
                diameter: fillConfig.diameter,
                mass: fillConfig.mass,
                stiffness: fillConfig.stiffness,
                scriptId: fillConfig.scriptId
              } as CircleCreateOption);
            }
          }
        }
      }catch(error){
      if(error instanceof EngineError){
          toast.error(error.message);
        }else{
          toast.error("生成できませんでした", {
            description: error instanceof Error ? error.message : "不明なエラーが発生しました"
          });
        }
      }

      setClickedPoint(null);
    }else{
      setClickedPoint(engine.toWorldPosition(Vector.from(point)));
    }
  }, [engine, clickedPoint, fillConfig]);

  return {
    onDown,
    onMove: () => {},
    onUp: () => {},
  };
}