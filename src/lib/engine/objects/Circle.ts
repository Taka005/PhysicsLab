import { CircleOption } from "../types";
import { BaseObject } from "./BaseObject";

export class Circle extends BaseObject{
  public diameter: number;

  constructor(option: CircleOption){
    super(option);

    this.diameter = option.diameter;

    if(this.entities.length === 0){

    }
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

    const circle = target as Circle;

    return (
      this.id == circle.id &&
      this.diameter == circle.diameter &&
      this.position.equals(circle.position) &&
      this.velocity.equals(circle.velocity) &&
      this.mass == circle.mass &&
      this.stiffness == circle.stiffness
    );
  }

  public static fromJSON(option: CircleOption): Circle{
    return new Circle(option);
  }
}