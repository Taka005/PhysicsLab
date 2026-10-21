import { BaseGround } from "./BaseGround";
import { BaseCreateOption, BaseGroundOption, CurveCreateOption, CurveOption } from "../types";
import { Vector } from "../utils/Vector";
import { normalizeAngle } from "../utils/normalizeAngle";

export class Curve extends BaseGround {
  public start: Vector;
  public middle: Vector;
  public center: Vector;
  public radius: number;
  public end: Vector;

  constructor(option: CurveOption) {
    super(option);

    this.start = Vector.from(option.start);
    this.middle = Vector.from(option.middle);
    this.end = Vector.from(option.end);
    this.center = this.calcCenter();
    this.radius = Vector.distance(this.start,this.center);
  }

  public calcCenter(): Vector{
    const slope1 = (this.middle.x - this.start.x) / (this.start.y - this.middle.y);
    const slope2 = (this.end.x - this.middle.x) / (this.middle.y - this.end.y);
    const equat1 = (this.start.y + this.middle.y) / 2 - slope1 * ((this.start.x + this.middle.x) / 2);
    const equat2 = (this.middle.y + this.end.y) / 2 - slope2 * ((this.middle.x + this.end.x) / 2);
    const centerX = (equat2 - equat1) / (slope1 - slope2);
    const centerY = slope1 * centerX + equat1;

    return new Vector(centerX, centerY);
  }

  public override solvePosition(position: Vector): Vector {
    const diff = Vector.subtract(position,this.center);

    const distance = diff.distance();
    if(distance == 0) return this.start;

    const scale = this.radius / distance;

    const cross = Vector.add(this.center,diff.multiply(scale));

    const startAngle = normalizeAngle(Math.atan2(this.start.y - this.center.y, this.start.x - this.center.x));
    const midAngle = normalizeAngle(Math.atan2(this.middle.y - this.center.y, this.middle.x - this.center.x));
    const endAngle = normalizeAngle(Math.atan2(this.end.y - this.center.y, this.end.x - this.center.x));
    const crossAngle = normalizeAngle(Math.atan2(cross.y - this.center.y, cross.x - this.center.x));

    const isClockwise = (startAngle > endAngle) ? (midAngle > startAngle || midAngle < endAngle) : (midAngle > startAngle && midAngle < endAngle);

    if(!Curve.IsAngleBetween(crossAngle, startAngle, endAngle, isClockwise)){
      const startDistance = Vector.distanceSquared(this.start, position);
      const endDistance = Vector.distanceSquared(this.end, position);

      if(startDistance < endDistance){
        return this.start;
      }else{
        return this.end;
      }
    }

    return cross;
  }

  public override equals(target: BaseGround): boolean {
    if(!(target instanceof Curve)) return false;

    return (
      this.id == target.id &&
      this.width == target.width &&
      this.start.equals(target.start) &&
      this.middle.equals(target.middle) &&
      this.end.equals(target.end)
    );
  }

  public override clone(): Curve {
    return new Curve(this.toJSON());
  }

  public override toJSON(): CurveOption {
    return {
      type: "curve",
      id: this.id,
      width: this.width,
      start: this.start,
      middle: this.middle,
      end: this.end
    }
  }

  public static IsAngleBetween(angle: number,startAngle: number,endAngle: number,isClockwise: boolean): boolean{
    if(isClockwise){
      return (angle >= startAngle && angle <= endAngle) || (startAngle > endAngle && (angle >= startAngle || angle <= endAngle));
    }else{
      return (angle <= startAngle && angle >= endAngle) || (startAngle < endAngle && (angle <= startAngle || angle >= endAngle));
    }
  }

  public static create(option: CurveCreateOption): Curve {
    return new Curve({
      type: option.type,
      id: option.id,
      width: option.width,
      start: option.start,
      middle: option.middle,
      end: option.end
    });
  }

  public static isCurveCreateOption(option: BaseCreateOption): option is CurveCreateOption {
    return option.type == "curve";
  }

  public static isCurveOption(option: BaseGroundOption): option is CurveOption {
    return option.type == "curve";
  }

  public static from(option: CurveOption): Curve {
    return new Curve(option);
  }
}