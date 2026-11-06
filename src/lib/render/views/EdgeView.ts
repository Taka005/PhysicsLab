import { BaseObject, Booster, Curve, Line } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class EdgeView{
  public static draw(graphics: Graphics,object: BaseObject){
    if(object instanceof Line){
      graphics.circle(object.start.x,object.start.y,object.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(object.end.x,object.end.y,object.width/2);
      graphics.stroke({ color: "gray", width: 1});
    }else if(object instanceof Curve){
      graphics.circle(object.start.x,object.start.y,object.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(object.middle.x,object.middle.y,object.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(object.center.x,object.center.y,object.width/2);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(object.end.x,object.end.y,object.width/2);
      graphics.stroke({ color: "gray", width: 1});
    }else if(object instanceof Booster){
      graphics.circle(object.start.x,object.start.y,1.5);
      graphics.stroke({ color: "gray", width: 1});

      graphics.circle(object.end.x,object.end.y,1.5);
      graphics.stroke({ color: "gray", width: 1});
    }
  }
}