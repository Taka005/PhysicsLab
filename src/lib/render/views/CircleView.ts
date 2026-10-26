import { Circle } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class CircleView{
  public static draw(graphics: Graphics,circle: Circle){
    graphics.clear();

    graphics.circle(circle.position.x,circle.position.y,circle.radius);
    graphics.fill({ color: circle.resource.color });
  }
}