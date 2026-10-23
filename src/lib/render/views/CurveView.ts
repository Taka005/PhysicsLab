import { Curve, normalizeAngle } from "@/lib/engine";
import { Graphics } from "pixi.js";

export class CurveView {
  public static draw(graphics: Graphics, curve: Curve): void {
    graphics.clear();

    const startAngle = normalizeAngle(Math.atan2(curve.start.y - curve.center.y, curve.start.x - curve.center.x));
    const endAngle = normalizeAngle(Math.atan2(curve.end.y - curve.center.y, curve.end.x - curve.center.x));
    const midAngle = normalizeAngle(Math.atan2(curve.middle.y - curve.center.y, curve.middle.x - curve.center.x));

    const clockwise = (startAngle > endAngle) 
      ? (midAngle > startAngle || midAngle < endAngle) 
      : (midAngle > startAngle && midAngle < endAngle);

    graphics.arc(
      curve.center.x,
      curve.center.y,
      curve.radius,
      startAngle,
      endAngle,
      !clockwise
    );
    
    graphics.stroke({ width: curve.width, color: "red" });

    graphics.circle(curve.start.x, curve.start.y, curve.width / 2);
    graphics.fill({ color: "red" });

    graphics.circle(curve.end.x, curve.end.y, curve.width / 2);
    graphics.fill({ color: "red" });
  }
}