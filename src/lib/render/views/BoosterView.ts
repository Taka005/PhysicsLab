import { Booster } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class BoosterView{
  public static draw(graphics: Graphics,booster: Booster){
    graphics.clear();

    const minX = Math.min(booster.start.x, booster.end.x);
    const minY = Math.min(booster.start.y, booster.end.y);
    const maxX = Math.max(booster.start.x, booster.end.x);
    const maxY = Math.max(booster.start.y, booster.end.y);

    graphics.rect(minX, minY, maxX - minX, maxY - minY);

    graphics.stroke({ width: 1.5, color: booster.resource.color });
  }
}