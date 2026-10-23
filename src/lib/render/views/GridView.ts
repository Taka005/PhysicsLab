import { Viewport } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class GridView{
  public static draw(
    graphics: Graphics,
    viewport: Viewport,
    worldSize: number,
    width: number,
    height: number
  ){
    graphics.clear();

    const worldStartX = -viewport.offset.x / viewport.zoomRatio;
    const worldStartY = -viewport.offset.y / viewport.zoomRatio;
    const worldEndX = worldStartX + width / viewport.zoomRatio;
    const worldEndY = worldStartY + height / viewport.zoomRatio;

    const startX = Math.floor(worldStartX / viewport.gridWidth) * viewport.gridWidth;
    const startY = Math.floor(worldStartY / viewport.gridWidth) * viewport.gridWidth;

    for(let x = startX; x <= worldEndX; x += viewport.gridWidth){
      const screenX = (x + viewport.offset.x / viewport.zoomRatio) * viewport.zoomRatio;

      graphics.moveTo(screenX, 0);
      graphics.lineTo(screenX, height);

      if(Math.abs(x) < worldSize){
        graphics.stroke({ width: 1, color: "gray" });
      }else{
        graphics.stroke({ width: 1, color: "red" });
      }
    }

    for(let y = startY; y <= worldEndY; y += viewport.gridWidth){
      const screenY = (y + viewport.offset.y / viewport.zoomRatio) * viewport.zoomRatio;

      graphics.moveTo(0, screenY);
      graphics.lineTo(width, screenY);

      if(Math.abs(y) < worldSize){
        graphics.stroke({ width: 1, color: "gray" });
      }else{
        graphics.stroke({ width: 1, color: "red" });
      }
    }
  }
}