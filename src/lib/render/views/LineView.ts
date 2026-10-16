import { Line } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class LineView{
  public static draw(graphics: Graphics,line: Line){
    graphics.clear();

    graphics.moveTo(line.start.x, line.start.y);
    graphics.lineTo(line.end.x, line.end.y);
    graphics.stroke({ width: line.width/2, color: "red" });

    graphics.circle(line.start.x, line.start.y, line.width/4);
    graphics.fill({ color: "red" });

    graphics.circle(line.end.x, line.end.y, line.width/4);
    graphics.fill({ color: "red" });
  }
}