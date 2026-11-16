
import { Entity } from "../objects/Entity";
import { BaseGround } from "../objects/BaseGround";
import { BaseEffect } from "../objects/BaseEffect";
import { Line } from "../objects/Line";
import { Curve } from "../objects/Curve";
import { Booster } from "../objects/Booster";
import { SpatialHashGrid } from "./SpatialHashGrid";

export class SpatialSystem {
  private entityGrid = new SpatialHashGrid<Entity>(32);
  private groundGrid = new SpatialHashGrid<BaseGround>(128);
  private effectGrid = new SpatialHashGrid<BaseEffect>(128);

  private entityCandidates: Entity[] = [];
  private groundCandidates: BaseGround[] = [];
  private effectCandidates: BaseEffect[] = [];

  public rebuildEntities(entities: Entity[]): void{
    this.entityGrid.clear();

    for(let i = 0; i < entities.length; i++){
      const entity = entities[i];
      const r = entity.radius;
      const p = entity.position;

      this.entityGrid.insert(
        p.x - r,
        p.y - r,
        p.x + r,
        p.y + r,
        entity
      );
    }
  }

  public rebuildGrounds(grounds: BaseGround[]): void{
    this.groundGrid.clear();

    for(let i = 0; i < grounds.length; i++){
      const ground = grounds[i];

      let minX: number;
      let minY: number;
      let maxX: number;
      let maxY: number;

      if(ground instanceof Line){
        minX = Math.min(ground.start.x, ground.end.x);
        minY = Math.min(ground.start.y, ground.end.y);
        maxX = Math.max(ground.start.x, ground.end.x);
        maxY = Math.max(ground.start.y, ground.end.y);
      }else if(ground instanceof Curve){
        minX = Math.min(
          ground.start.x,
          ground.middle.x,
          ground.end.x
        );

        minY = Math.min(
          ground.start.y,
          ground.middle.y,
          ground.end.y
        );

        maxX = Math.max(
          ground.start.x,
          ground.middle.x,
          ground.end.x
        );

        maxY = Math.max(
          ground.start.y,
          ground.middle.y,
          ground.end.y
        );
      }else{
        continue;
      }

      const padding = ground.width / 2;

      this.groundGrid.insert(
        minX - padding,
        minY - padding,
        maxX + padding,
        maxY + padding,
        ground
      );
    }
  }

  public rebuildEffects(effects: BaseEffect[]): void{
    this.effectGrid.clear();

    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];

      if (!(effect instanceof Booster)) continue;

      this.effectGrid.insert(
        Math.min(effect.start.x, effect.end.x),
        Math.min(effect.start.y, effect.end.y),
        Math.max(effect.start.x, effect.end.x),
        Math.max(effect.start.y, effect.end.y),
        effect
      );
    }
  }

  public queryEntities(entity: Entity): Entity[]{
    const p = entity.position;
    const r = entity.radius;

    this.entityGrid.query(
      p.x - r,
      p.y - r,
      p.x + r,
      p.y + r,
      this.entityCandidates
    );

    return this.entityCandidates;
  }

  public queryGrounds(entity: Entity): BaseGround[]{
    const p = entity.position;
    const r = entity.radius;

    this.groundGrid.query(
      p.x - r,
      p.y - r,
      p.x + r,
      p.y + r,
      this.groundCandidates
    );

    return this.groundCandidates;
  }

  public queryEffects(entity: Entity): BaseEffect[]{
    const p = entity.position;
    const r = entity.radius;

    this.effectGrid.query(
      p.x - r,
      p.y - r,
      p.x + r,
      p.y + r,
      this.effectCandidates
    );

    return this.effectCandidates;
  }
}
