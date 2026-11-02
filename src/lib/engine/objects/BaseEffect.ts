import { BaseEffectOption } from "../types";
import { BaseObject } from "./BaseObject";
import { Entity } from "./Entity";

export abstract class BaseEffect extends BaseObject{
  constructor(option: BaseEffectOption) {
    super(option);
  }

  public abstract setEffect(target: Entity,deltaTime: number): void;
  public abstract toJSON(): BaseEffectOption;
  public abstract clone(): BaseEffect;
  public abstract equals(target: BaseEffect): boolean;
}