import { BaseBody } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class VectorView{
  public static draw(graphics: Graphics,body: BaseBody){
    if(body.velocity.isZero()) return;

    graphics.moveTo(body.position.x, body.position.y);
    graphics.lineTo(body.position.x + body.velocity.x, body.position.y + body.velocity.y);
    graphics.stroke({ width: 1, color: "gray" });
  }
}