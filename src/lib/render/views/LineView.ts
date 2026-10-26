import { Line } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class LineView{
  public static draw(graphics: Graphics,line: Line){
    graphics.clear();

    graphics.moveTo(line.start.x, line.start.y);
    graphics.lineTo(line.end.x, line.end.y);
    graphics.stroke({ width: line.width, color: line.resource.color });

    graphics.circle(line.start.x, line.start.y, line.width/2);
    graphics.fill({ color: line.resource.color });

    graphics.circle(line.end.x, line.end.y, line.width/2);
    graphics.fill({ color: line.resource.color });
  }
}