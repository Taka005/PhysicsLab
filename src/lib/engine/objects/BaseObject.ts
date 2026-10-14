import { Entity } from "./Entity";
import { Vector } from "../utils/Vector";
import type { EntityOption, BaseObjectOption } from "../types";
import { createId } from "../utils/createId";

export abstract class BaseObject{
  public id: string;
  public readonly trackingId: string = createId(10);
  public readonly entities: Entity[] = [];

  constructor(option: BaseObjectOption) {
    this.id = option.id;
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

  public set position(position: Vector) {
    const diff = position.subtract(this.position);

    this.entities.forEach(entity => {
      entity.position = entity.position.add(diff);
      entity.prePosition = entity.prePosition.add(diff);
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
  public abstract Clone(): this;
  public abstract Equals(target: BaseObject): boolean;
}