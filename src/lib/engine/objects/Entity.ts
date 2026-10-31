import { Vector } from "../utils/Vector";
import type { EntityOption } from "../types";
import { Connection } from "../utils/Connection";

export class Entity {
  public readonly id: string;
  public position: Vector;
  public prePosition: Vector;
  public velocity: Vector;
  public diameter: number;
  public stiffness: number;
  public connection: Connection;
  private _mass: number;
  private _invMass: number;

  constructor(option: EntityOption) {
    this.id = option.id;
    this.position = Vector.from(option.position);
    this.prePosition = Vector.from(option.position);
    this.velocity = Vector.from(option.velocity);
    this.diameter = option.diameter;
    this._mass = option.mass;
    this._invMass = option.mass === 0 ? 0 : 1 / option.mass;
    this.stiffness = option.stiffness;
    this.connection = new Connection(option.connections);
  }

  public get radius(): number {
    return this.diameter / 2;
  }

  public get mass(): number {
    return this._mass;
  }

  public set mass(value: number){
    this._mass = value;

    this._invMass = this.mass === 0 ? 0 : 1 / this.mass;
  }

  public get invMass(): number {
    return this._invMass;
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
      connections: this.connection.targets
    };
  }
}