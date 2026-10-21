import { BaseGround } from "./BaseGround";
import { BaseCreateOption, BaseGroundOption, LineCreateOption, LineOption } from "../types";
import { Vector } from "../utils/Vector";

export class Line extends BaseGround {
  public start: Vector;
  public end: Vector;

  constructor(option: LineOption) {
    super(option);

    this.start = Vector.from(option.start);
    this.end = Vector.from(option.end);
  }

  public override solvePosition(position: Vector): Vector {
    const flag = ((position.x - this.start.x)*(this.end.x - this.start.x) + (position.y - this.start.y)*(this.end.y - this.start.y))/Vector.distanceSquared(this.start,this.end);

    if(flag <= 0){
      return this.start;
    }else if(flag >= 1){
      return this.end;
    }else{
      const crossX = this.start.x + flag*(this.end.x - this.start.x);
      const crossY = this.start.y + flag*(this.end.y - this.start.y);

      return new Vector(crossX, crossY);
    }
  }

  public override equals(target: BaseGround): boolean {
    if(!(target instanceof Line)) return false;

    return (
      this.id == target.id &&
      this.width == target.width &&
      this.start.equals(target.start) &&
      this.end.equals(target.end)
    );
  }

  public override clone(): Line {
    return new Line(this.toJSON());
  }

  public override toJSON(): LineOption {
    return {
      type: "line",
      id: this.id,
      width: this.width,
      start: this.start,
      end: this.end
    }
  }

  public static create(option: LineCreateOption): Line {
    return new Line({
      type: option.type,
      id: option.id,
      width: option.width,
      start: option.start,
      end: option.end
    });
  }

  public static isLineCreateOption(option: BaseCreateOption): option is LineCreateOption {
    return option.type == "line";
  }

  public static isLineOption(option: BaseGroundOption): option is LineOption {
    return option.type == "line";
  }

  public static from(option: LineOption): Line {
    return new Line(option);
  }
}