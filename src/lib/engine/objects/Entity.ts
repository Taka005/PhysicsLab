import { Vector } from "../utils/Vector";
import type { EntityOption } from "../types";
import { Connection } from "../utils/Connection";

export class Entity {
  public readonly id: string;
  public position: Vector;
  public prePosition: Vector;
  public velocity: Vector;
  public diameter: number;
  public mass: number;
  public stiffness: number;
  public connection: Connection;
  public parentId: string;

  constructor(option: EntityOption) {
    this.id = option.id;
    this.position = Vector.from(option.position);
    this.prePosition = Vector.from(option.position);
    this.velocity = Vector.from(option.velocity);
    this.diameter = option.diameter;
    this.mass = option.mass;
    this.stiffness = option.stiffness;
    this.connection = new Connection(option.targets);
    this.parentId = option.parentId;
  }

  public get radius(): number {
    return this.diameter / 2;
  }

  public get invMass(): number {
    if(this.mass === 0) return 0;

    return 1/this.mass;
  }

  public get isStop(): boolean {
    return this.position.equals(this.prePosition);
  }

  public savePosition(): void{
    this.prePosition = this.position.clone();
  }

  public toJSON(): EntityOption {
    return {
      id: this.id,
      position: this.position,
      velocity: this.velocity,
      diameter: this.diameter,
      mass: this.mass,
      stiffness: this.stiffness,
      targets: this.connection.targets,
      parentId: this.parentId
    };
  }
}