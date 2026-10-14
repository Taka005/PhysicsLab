import { CircleOption, CircleCreateOption, EntityOption } from "../types";
import { BaseObject } from "./BaseObject";

export class Circle extends BaseObject{
  public diameter: number;

  constructor(option: CircleOption){
    super(option);

    this.diameter = option.diameter;
  }

  public override toJSON(): CircleOption {
    return {
      type: "circle",
      id: this.id,
      trackingId: this.trackingId,
      diameter: this.diameter,
      entities: this.entities.map(entity=>entity.toJSON())
    }
  }

  public override clone(): Circle {
    return new Circle(this.toJSON());
  }

  public override equals(target: BaseObject): boolean {
    if(!(target instanceof Circle)) return false;

    return (
      this.id == target.id &&
      this.diameter == target.diameter &&
      this.position.equals(target.position) &&
      this.velocity.equals(target.velocity) &&
      this.mass == target.mass &&
      this.stiffness == target.stiffness
    );
  }

  public static create(option: CircleCreateOption): Circle {
    const entityOption: EntityOption = {
      id: option.id,
      position: option.position,
      velocity: option.velocity,
      diameter: option.diameter,
      mass: option.mass,
      stiffness: option.stiffness,
      targets: [],
      parentId: option.id
    };

    return new Circle({
      type: "circle",
      id: option.id,
      diameter: option.diameter,
      entities: [entityOption]
    });
  }

  public static from(option: CircleOption): Circle{
    return new Circle(option);
  }
}