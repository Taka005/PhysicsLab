import { Circle } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class CircleView{
  public static draw(graphics: Graphics,circle: Circle){
    graphics.clear();

    graphics.circle(0,0,circle.diameter);
    graphics.fill({ color: "red"});
    graphics.position.set(circle.position.x,circle.position.y);
  }
}