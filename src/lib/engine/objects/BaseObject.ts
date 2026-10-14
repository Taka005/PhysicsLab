import { Entity } from "./Entity";
import { Vector } from "../utils/Vector";
import type { EntityOption, BaseObjectOption } from "../types";
import { createId } from "../utils/createId";

export abstract class BaseObject{
  public id: string;
  public readonly trackingId: string;
  public readonly entities: Entity[] = [];

  constructor(option: BaseObjectOption) {
    this.id = option.id;
    this.trackingId = option.trackingId ?? createId(10);

    this.addAllEntities(option.entities ?? []);
  }

  public get count(): number {
    return this.entities.length;
  }

  public setId(id: string): void {
    this.id = id;

    this.entities.forEach(entity => {
      entity.parentId = id;
    });
  }

  public isStop(): boolean {
    return this.entities.every(entity => entity.isStop);
  }

  public get position(): Vector {
    if (this.entities.length === 0) return new Vector(0, 0);

    const averageX = this.entities.reduce((sum, entity) => sum + entity.position.x, 0) / this.entities.length;
    const averageY = this.entities.reduce((sum, entity) => sum + entity.position.y, 0) / this.entities.length;

    return new Vector(averageX, averageY);
  }

  public set position(value: Vector) {
    const diff = value.subtract(this.position);

    this.entities.forEach(entity => {
      entity.position.x += diff.x;
      entity.position.y += diff.y;
      entity.prePosition.x += diff.x;
      entity.prePosition.y += diff.y;
    });
  }

  public get velocity(): Vector {
    if (this.entities.length === 0) return new Vector(0, 0);

    const averageX = this.entities.reduce((sum, entity) => sum + entity.velocity.x, 0) / this.entities.length;
    const averageY = this.entities.reduce((sum, entity) => sum + entity.velocity.y, 0) / this.entities.length;

    return new Vector(averageX, averageY);
  }

  public set velocity(value: Vector) {
    this.entities.forEach(entity => {
      entity.velocity = value;
    });
  }

  public get mass(): number {
    return this.entities.reduce((sum, entity) => sum + entity.mass, 0);
  }

  public set mass(value: number) {
    this.entities.forEach(entity => {
      entity.mass = value / this.count;
    });
  }

  public get stiffness(): number {
    return this.entities.reduce((sum, entity) => sum + entity.stiffness, 0) / this.count;
  }

  public set stiffness(value: number) {
    this.entities.forEach(entity => {
      entity.stiffness = value;
    });
  }

  protected addEntity(entityOption: EntityOption): Entity {
    const entity = new Entity(entityOption);

    entity.parentId = this.id;
    this.entities.push(entity);

    return entity;
  }

  protected addAllEntities(entityOptions: EntityOption[]): void {
    entityOptions.forEach(entityOption => {
      this.addEntity(entityOption);
    });
  }

  public abstract toJSON(): BaseObjectOption;
  public abstract clone(): BaseObject;
  public abstract equals(target: BaseObject): boolean;
}