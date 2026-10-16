import { BaseGroundOption } from "../types";
import { Vector } from "../utils/Vector";
import { BaseObject } from "./BaseObject";

export abstract class BaseGround extends BaseObject{
  public width: number;

  constructor(option: BaseGroundOption) {
    super(option);

    this.width = option.width;
  }

  public abstract solvePosition(position: Vector): Vector;
  public abstract toJSON(): BaseGroundOption;
  public abstract clone(): BaseGround;
  public abstract equals(target: BaseGround): boolean;
}