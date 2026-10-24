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

    for (let x = startX; x <= worldEndX; x += viewport.gridWidth) {
      if (x < -worldSize || x > worldSize) {
        graphics.moveTo(x, worldStartY);
        graphics.lineTo(x, worldEndY);
        graphics.stroke({ width: 1, color: "red" });
      } else {
        if (worldStartY < -worldSize) {
          graphics.moveTo(x, worldStartY);
          graphics.lineTo(x, -worldSize);
          graphics.stroke({ width: 1, color: "red" });
        }

        const innerStartY = Math.max(worldStartY, -worldSize);
        const innerEndY = Math.min(worldEndY, worldSize);
        if (innerStartY < innerEndY) {
          graphics.moveTo(x, innerStartY);
          graphics.lineTo(x, innerEndY);
          graphics.stroke({ width: 1, color: "gray" });
        }

        if (worldEndY > worldSize) {
          graphics.moveTo(x, worldSize);
          graphics.lineTo(x, worldEndY);
          graphics.stroke({ width: 1, color: "red" });
        }
      }
    }

    for (let y = startY; y <= worldEndY; y += viewport.gridWidth) {
      if (y < -worldSize || y > worldSize) {
        graphics.moveTo(worldStartX, y);
        graphics.lineTo(worldEndX, y);
        graphics.stroke({ width: 1, color: "red" });
      } else {
        if (worldStartX < -worldSize) {
          graphics.moveTo(worldStartX, y);
          graphics.lineTo(-worldSize, y);
          graphics.stroke({ width: 1, color: "red" });
        }

        const innerStartX = Math.max(worldStartX, -worldSize);
        const innerEndX = Math.min(worldEndX, worldSize);
        if (innerStartX < innerEndX) {
          graphics.moveTo(innerStartX, y);
          graphics.lineTo(innerEndX, y);
          graphics.stroke({ width: 1, color: "gray" });
        }

        if (worldEndX > worldSize) {
          graphics.moveTo(worldSize, y);
          graphics.lineTo(worldEndX, y);
          graphics.stroke({ width: 1, color: "red" });
        }
      }
    }
  }
}