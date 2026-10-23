import { Viewport } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class GridView {
  public static draw(graphics: Graphics, viewport: Viewport, worldSize: number, width: number, height: number) {
    graphics.clear();

    const worldStartX = -viewport.offset.x / viewport.zoomRatio;
    const worldStartY = -viewport.offset.y / viewport.zoomRatio;
    const worldEndX = worldStartX + width / viewport.zoomRatio;
    const worldEndY = worldStartY + height / viewport.zoomRatio;

    const startX = Math.floor(worldStartX / viewport.gridWidth) * viewport.gridWidth;
    const startY = Math.floor(worldStartY / viewport.gridWidth) * viewport.gridWidth;

    const toScreenX = (x: number): number =>{
      return (x + viewport.offset.x / viewport.zoomRatio) * viewport.zoomRatio;
    }

    const toScreenY = (y: number): number =>{
      return (y + viewport.offset.y / viewport.zoomRatio) * viewport.zoomRatio;
    }

    for (let x = startX; x <= worldEndX; x += viewport.gridWidth) {
      const screenX = toScreenX(x);

      if (x < -worldSize || x > worldSize) {
        graphics.moveTo(screenX, 0);
        graphics.lineTo(screenX, height);
        graphics.stroke({ width: 1, color: "red" });
      } else {
        if (worldStartY < -worldSize) {
          graphics.moveTo(screenX, toScreenY(worldStartY));
          graphics.lineTo(screenX, toScreenY(-worldSize));
          graphics.stroke({ width: 1, color: "red" });
        }

        const innerStartY = Math.max(worldStartY, -worldSize);
        const innerEndY = Math.min(worldEndY, worldSize);
        if (innerStartY < innerEndY) {
          graphics.moveTo(screenX, toScreenY(innerStartY));
          graphics.lineTo(screenX, toScreenY(innerEndY));
          graphics.stroke({ width: 1, color: "gray" });
        }

        if (worldEndY > worldSize) {
          graphics.moveTo(screenX, toScreenY(worldSize));
          graphics.lineTo(screenX, toScreenY(worldEndY));
          graphics.stroke({ width: 1, color: "red" });
        }
      }
    }

    for (let y = startY; y <= worldEndY; y += viewport.gridWidth) {
      const screenY = toScreenX(y);

      if (y < -worldSize || y > worldSize) {
        graphics.moveTo(0, screenY);
        graphics.lineTo(width, screenY);
        graphics.stroke({ width: 1, color: "red" });
      } else {
        if (worldStartX < -worldSize) {
          graphics.moveTo(toScreenX(worldStartX), screenY);
          graphics.lineTo(toScreenX(-worldSize), screenY);
          graphics.stroke({ width: 1, color: "red" });
        }

        const innerStartX = Math.max(worldStartX, -worldSize);
        const innerEndX = Math.min(worldEndX, worldSize);
        if (innerStartX < innerEndX) {
          graphics.moveTo(toScreenX(innerStartX), screenY);
          graphics.lineTo(toScreenX(innerEndX), screenY);
          graphics.stroke({ width: 1, color: "gray" });
        }

        if (worldEndX > worldSize) {
          graphics.moveTo(toScreenX(worldSize), screenY);
          graphics.lineTo(toScreenX(worldEndX), screenY);
          graphics.stroke({ width: 1, color: "red" });
        }
      }
    }
  }
}