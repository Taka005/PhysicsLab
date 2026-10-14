import { BaseGround } from "./BaseGround";
import { LineOption } from "../types";
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
    const flag = ((position.x - this.start.x)*(this.end.x - this.start.x) + (position.y - this.start.y)*(this.end.y - this.start.y))/this.start.subtract(this.end).lengthSquared();

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
}