import { Entity } from "../objects/Entity";

export class Group{
  public targets: Entity[];
  public dampingK: number;

  constructor(targets: Entity[],dampingK: number){
    this.targets = targets;
    this.dampingK = dampingK;
  }
}