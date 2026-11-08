import { EngineBaseOption, Target } from "./types";
import { Entity } from "./objects/Entity";
import { BaseGround } from "./objects/BaseGround";
import { Vector } from "./utils/Vector";
import { EngineError } from "./utils/EngineError";

export class EngineBase{
  public _pps: number;
  public _gravity: number;
  public _friction: number;
  public readonly CORRECTION_NUMBER: number = 0.00000001;
  public readonly FRICTION_STRENGTH: number = 0.1;
  private onChanged: () => void;

  constructor(option: EngineBaseOption,onChanged: () => void){
    this._pps = option.pps;
    this._gravity = option.gravity;
    this._friction = option.friction;
    this.onChanged = onChanged;
  }

  public get pps(): number{
    return this._pps;
  }

  public set pps(value: number) {
    if(value <= 0) throw new EngineError("PPSは0を超える必要があります");

    this._pps = value;
    this.onChanged();
  }

  public get gravity(): number{
    return this._gravity;
  }

  public set gravity(value: number) {
    if(value < 0) throw new EngineError("重力加速度は0を超える必要があります");

    this._gravity = value;
    this.onChanged();
  }

  public get friction(): number{
    return this._friction;
  }

  public set friction(value: number) {
    this._friction = value;
    this.onChanged();
  }

  public get deltaTime(): number{
    return 1/this.pps;
  }

  protected solvePosition(source: Entity,target: Entity): void{
    const totalInvMass = source.invMass + target.invMass;
    if(totalInvMass === 0) return;

    const diffX = target.position.x - source.position.x;
    const diffY = target.position.y - source.position.y;

    const totalRadius = source.radius + target.radius;

    if(
      Math.abs(diffX) >= totalRadius||
      Math.abs(diffY) >= totalRadius
    ) return;

    const distanceSquared = diffX*diffX + diffY*diffY;
    if(distanceSquared > totalRadius*totalRadius) return;

    const distance = Math.sqrt(distanceSquared);

    const move = (distance - totalRadius)/(distance*totalInvMass + this.CORRECTION_NUMBER) * source.stiffness;
    const correctionX = diffX*move;
    const correctionY = diffY*move;

    source.position.x += correctionX*source.invMass;
    source.position.y += correctionY*source.invMass;

    target.position.x -= correctionX*target.invMass;
    target.position.y -= correctionY*target.invMass;
  }

  protected solveGroundPosition(entity: Entity,ground: BaseGround): void{
    if(entity.invMass === 0) return;

    const cross = ground.solvePosition(entity.position);

    const diffX = cross.x - entity.position.x;
    const diffY = cross.y - entity.position.y;

    const distanceSquared = diffX*diffX + diffY*diffY;
    if(distanceSquared > (entity.radius + ground.width/2) * (entity.radius + ground.width/2)) return;

    const distance = Math.sqrt(distanceSquared);

    const move = (distance - (entity.radius + ground.width/2))/(distance*entity.invMass + this.CORRECTION_NUMBER) * entity.stiffness;
    const correctionX = diffX*move;
    const correctionY = diffY*move;

    entity.position.x += correctionX*entity.invMass;
    entity.position.y += correctionY*entity.invMass;
  }

  protected solveConnection(source: Entity,target: Entity,targetData: Target): void{
    const totalInvMass = source.invMass + target.invMass;
    if(totalInvMass === 0) return;

    const diffX = target.position.x - source.position.x;
    const diffY = target.position.y - source.position.y;

    const distance = Math.sqrt(diffX*diffX + diffY*diffY);

    const move = (distance - targetData.distance)/(distance*totalInvMass + this.CORRECTION_NUMBER) * targetData.stiffness;
    const correctionX = diffX*move;
    const correctionY = diffY*move;

    source.position.x += correctionX*source.invMass;
    source.position.y += correctionY*source.invMass;

    target.position.x -= correctionX*target.invMass;
    target.position.y -= correctionY*target.invMass;
  }

  protected solveVelocity(entity: Entity): void{
    const k = entity.mass*this.friction*this.FRICTION_STRENGTH;

    entity.velocity.x -= k*entity.velocity.x*this.deltaTime;
    entity.velocity.y -= k*entity.velocity.y*this.deltaTime;
  }

  protected updateVelocity(entity: Entity): void{
    entity.velocity.x = (entity.position.x - entity.prePosition.x)/(1/this.pps);
    entity.velocity.y = (entity.position.y - entity.prePosition.y)/(1/this.pps);

    if(entity.mass != 0){
      entity.velocity.y += this.gravity*this.deltaTime;
    }
  }

  protected updatePosition(entity: Entity): void{
    entity.savePosition();

    entity.position.x += entity.velocity.x*this.deltaTime;
    entity.position.y += entity.velocity.y*this.deltaTime;
  }
}