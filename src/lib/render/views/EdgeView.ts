import { BaseGround, Curve, Line } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class EdgeView{
  public static draw(graphics: Graphics,ground: BaseGround){
    if(ground instanceof Line){
      graphics.circle(ground.start.x,ground.start.y,ground.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(ground.end.x,ground.end.y,ground.width/2);
      graphics.stroke({ color: "gray", width: 1});
    }else if(ground instanceof Curve){
      graphics.circle(ground.start.x,ground.start.y,ground.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(ground.middle.x,ground.middle.y,ground.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(ground.center.x,ground.center.y,ground.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(ground.end.x,ground.end.y,ground.width/2);
      graphics.stroke({ color: "gray", width: 1});
    }
  }
}