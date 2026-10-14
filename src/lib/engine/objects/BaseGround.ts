import { BaseGroundOption } from "../types";
import { Vector } from "../utils/Vector";

export abstract class BaseGround {
  public id: string;
  public width: number;

  constructor(option: BaseGroundOption) {
    this.id = option.id;
    this.width = option.width;
  }

  public abstract solvePosition(position: Vector): Vector;
  public abstract toJSON(): BaseGroundOption;
  public abstract clone(): BaseGround;
  public abstract equals(target: BaseGround): boolean;
}