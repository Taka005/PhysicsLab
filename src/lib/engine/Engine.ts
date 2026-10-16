import { EngineBase } from "./EngineBase";
import { BaseBody } from "./objects/BaseBody";
import { BaseGround } from "./objects/BaseGround";
import { Circle } from "./objects/Circle";
import { Line } from "./objects/Line";
import { BaseCreateOption, EngineOption, ViewportOption } from "./types";
import { ContentManager } from "./utils/ContentManager";
import { Viewport } from "./utils/Viewport";

export class Engine extends EngineBase {
  public isStarted: boolean = false;

  public isTrackingMode: boolean = false;

  public isDynamicTrackingMode: boolean = false;

  public playBackSpeed: number;

  public trackingInterval: number;

  public trackingLimit: number;

  public worldSize: number;

  public readonly viewport: Viewport;

  private trackingCount: number = 0;

  private readonly content: ContentManager = new ContentManager();

  constructor(engineOption: EngineOption,viewportOption: ViewportOption) {
    super(engineOption);

    this.viewport = new Viewport(viewportOption);

    this.playBackSpeed = engineOption.playBackSpeed ?? 1;
    this.trackingInterval = engineOption.trackingInterval ?? 1000;
    this.trackingLimit = engineOption.trackingLimit ?? 100;
    this.worldSize = engineOption.worldSize ?? 1000;
  }

  public getBodies(): BaseBody[]{
    return this.content.bodies;
  }

  public getGrounds(): BaseGround[]{
    return this.content.grounds;
  }

  public start(): void {
    if(this.isStarted) return;

    this.isStarted = true;

    this.update();
  }

  public stop(): void {
    this.isStarted = false;
  }

  public clear(isAll: boolean = false): void {
    this.content.removeAllBodies();

    if(isAll){
      this.content.removeAllGrounds();
      this.content.removeAllTrackBodies();
    }
  }

  private update(): void{
    if(!this.isStarted) return;

    this.step();

    setTimeout(() => this.update(),(1000/this.pps)/this.playBackSpeed);
  }

  public step(): void{
    const trackingLimit = this.isDynamicTrackingMode ? this.trackingLimit*this.content.bodiesCount : this.trackingLimit;

    this.trackingCount += 1000/this.pps;

    if(this.trackingCount >= this.trackingInterval){
      const noStopBodies = this.content.bodies.filter(obj => !obj.isStop);

      for(let i = 0;noStopBodies.length < 0;i++){
        this.content.addTrackBody(noStopBodies[i]);
      }

      while(this.content.trackBodiesCount > trackingLimit){
        this.content.removeAllTrackBodies();
      }

      this.trackingCount %= this.trackingInterval;
    }

    for(let i = 0;i < this.content.entitiesCount;i++){
      const source = this.content.entities[i];

      for(let j = 0;j < this.content.groundsCount;j++){
        const ground = this.content.grounds[j];

        this.solveGroundPosition(source,ground);
      }

      for(let j = i + 1;j < this.content.entitiesCount;j++){
        const target = this.content.entities[j];

        this.solvePosition(source,target);
      }
    }

    for(let i = 0;i < this.content.entitiesCount;i++){
      const entity = this.content.entities[i];

      this.updateVelocity(entity);
      this.solveVelocity(entity);
    }

    for(let i = 0;i < this.content.bodiesCount;i++){
      const body = this.content.bodies[i];

      if(
        Math.abs(body.position.x) > this.worldSize||
        Math.abs(body.position.x) > this.worldSize
      ){
        this.deSpawn(body.id);
      }
    }
  }

  public spawn(option: BaseCreateOption): BaseBody {
    if(Circle.isCircleCreateOption(option)){
      const circle = Circle.create(option);

      this.content.addBody(circle);

      return circle;
    }else if(Line.isLineCreateOption(option)){
      const line = Line.create(option);

      this.content.addGround(line);
    }

    throw new Error("存在しないオブジェクトタイプです");
  }

  public deSpawn(id: string): void {
    this.content.removeBody(id);
    this.content.removeGround(id);
  }
}