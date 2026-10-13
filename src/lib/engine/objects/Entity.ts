import { Vector } from "../utils/Vector";

export class Entity {
  public readonly id: string;
  public position: Vector;
  public prePosition: Vector;
  public velocity: Vector;
  public diameter: number;
  public mass: number;
  public stiffness: number;
  public targets: Target[] = [];
  public parentId: string;

  constructor(option: EntityOption) {
    this.id = option.id;
    this.position = Vector.from(option.position);
    this.prePosition = Vector.from(option.position);
    this.velocity = Vector.from(option.velocity);
    this.diameter = option.diameter;
    this.mass = option.mass;
    this.stiffness = option.stiffness;
    this.targets = option.targets;
    this.parentId = option.parentId;
  }
}