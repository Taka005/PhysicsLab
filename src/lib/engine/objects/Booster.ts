import { BaseCreateOption, BaseEffectOption, BoosterCreateOption, BoosterOption } from "../types";
import { Vector } from "../utils/Vector";
import { BaseEffect } from "./BaseEffect";
import { Entity } from "./Entity";

export class Booster extends BaseEffect{
  public start: Vector;
  public end: Vector;
  public velocity: Vector;

  constructor(option: BoosterOption){
    super(option);

    this.start = Vector.from(option.start);
    this.end = Vector.from(option.end);
    this.velocity = Vector.from(option.velocity);
  }

  public override setEffect(target: Entity, deltaTime: number): void {
    if(target.mass == 0) return;

    const diff = Vector.subtract(target.position, Vector.add(this.start,this.end).divide(2));

    if(
      Math.abs(diff.x) >= Math.abs(this.start.x - this.end.x)/2||
      Math.abs(diff.y) >= Math.abs(this.start.y - this.end.y)/2
    ) return;

    target.velocity.x += this.velocity.x*deltaTime;
    target.velocity.y += this.velocity.y*deltaTime;
  }

  public override equals(target: BaseEffect): boolean {
    if(!(target instanceof Booster)) return false;

    return (
      this.id == target.id &&
      this.start.equals(target.start) &&
      this.end.equals(target.end) &&
      this.velocity.equals(target.velocity)
    );
  }

  public override clone(): Booster {
    return new Booster(this.toJSON());
  }

  public override toJSON(): BoosterOption {
    return {
      type: "booster",
      id: this.id,
      resource: this.resource.toJSON(),
      start: this.start,
      end: this.end,
      velocity: this.velocity,
      scriptId: this.scriptId
    }
  }

  public static isBoosterCreateOption(option: BaseCreateOption): option is BoosterCreateOption {
    return option.type == "booster";
  }

  public static isBoosterOption(option: BaseEffectOption): option is BoosterOption {
    return option.type == "circle";
  }

  public static from(option: BoosterOption): Booster{
    return new Booster(option);
  }
}