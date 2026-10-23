import { EngineBase } from "./EngineBase";
import { BaseObject } from "./objects/BaseObject";
import { Circle } from "./objects/Circle";
import { Curve } from "./objects/Curve";
import { Line } from "./objects/Line";
import { saveDataSchema } from "./typeSchema";
import { BaseCreateOption, DEFAULT_ENGINE_VALUE, DEFAULT_VIEWPORT_VALUE, EngineOption, EngineSnapShot, SaveData, ViewportOption } from "./types";
import { ContentManager } from "./utils/ContentManager";
import { Vector } from "./utils/Vector";
import { Viewport } from "./utils/Viewport";

export class Engine extends EngineBase {
  public isStarted: boolean = false;

  private _isTrackingMode = false;

  private _isDynamicTrackingMode: boolean = false;

  private _isSetGridCrossMode: boolean = false;

  private _isDebugMode: boolean = false;

  private _playBackSpeed: number;

  private _trackingInterval: number;

  private _trackingLimit: number;

  private _worldSize: number;

  public readonly viewport: Viewport;

  private trackingCount: number = 0;

  private readonly content: ContentManager = new ContentManager();

  private listeners = new Set<() => void>();

  private snapshot: EngineSnapShot;

  constructor(engineOption: EngineOption = DEFAULT_ENGINE_VALUE,viewportOption: ViewportOption = DEFAULT_VIEWPORT_VALUE) {
    super(engineOption,() => this.notify());

    this.viewport = new Viewport(viewportOption,() => this.notify());

    this._playBackSpeed = engineOption.playBackSpeed;
    this._trackingInterval = engineOption.trackingInterval;
    this._trackingLimit = engineOption.trackingLimit;
    this._worldSize = engineOption.worldSize;

    this.snapshot = this.createSnapshot();
  }

  public get isTrackingMode(): boolean{
    return this._isTrackingMode;
  }

  public set isTrackingMode(value: boolean){
    this._isTrackingMode = value;
    this.notify();
  }

  public get isDynamicTrackingMode(): boolean{
    return this._isDynamicTrackingMode;
  }

  public set isDynamicTrackingMode(value: boolean) {
    this._isDynamicTrackingMode = value;
    this.notify();
  }

  public get isSetGridCrossMode(): boolean{
    return this._isSetGridCrossMode;
  }

  public set isSetGridCrossMode(value: boolean) {
    this._isSetGridCrossMode = value;
    this.notify();
  }

  public get isDebugMode(): boolean{
    return this._isDebugMode;
  }

  public set isDebugMode(value: boolean) {
    this._isDebugMode = value;
    this.notify();
  }

  public get playBackSpeed(): number{
    return this._playBackSpeed;
  }

  public set playBackSpeed(value: number) {
    if(value <= 0) throw new Error("再生速度は0を超える必要があります");

    this._playBackSpeed = value;
    this.notify();
  }

  public get trackingInterval(): number{
    return this._trackingInterval;
  }

  public set trackingInterval(value: number) {
    if(value <= 0) throw new Error("トラッキング間隔は0を超える必要があります");

    this._trackingInterval = value;
    this.notify();
  }

  public get trackingLimit(): number{
    return this._trackingLimit;
  }

  public set trackingLimit(value: number) {
    if(value <= 0) throw new Error("最大トラッキング数は0を超える必要があります");

    this._trackingLimit = value;
    this.notify();
  }

  public get worldSize(): number{
    return this._worldSize;
  }

  public set worldSize(value: number) {
    if(value <= 0) throw new Error("ワールドサイズは0を超える必要があります");

    this._worldSize = value;
    this.notify();
  }

  private createSnapshot(): EngineSnapShot{
    return {
      isStarted: this.isStarted,
      isTrackingMode: this.isTrackingMode,
      isDynamicTrackingMode: this.isDynamicTrackingMode,
      isDebugMode: this.isDebugMode,
      isSetGridCrossMode: this.isSetGridCrossMode,
      isDisplayGrid: this.viewport.isDisplayGrid,
      isDisplayVector: this.viewport.isDisplayVector,
      isDisplayEdge: this.viewport.isDisplayEdge,
      playBackSpeed: this.playBackSpeed,
      worldSize: this.worldSize,
      trackingInterval: this.trackingInterval,
      trackingLimit: this.trackingLimit,
      gridWidth: this.viewport.gridWidth,
      gravity: this.gravity,
      pps: this.pps,
      friction: this.friction
    };
  }

  private notify() {
    this.snapshot = this.createSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = () => {
    return this.snapshot;
  };

  public reset(): void{
    this.viewport.reset();

    this.isTrackingMode = false;
    this.isDynamicTrackingMode = false;
    this.isDebugMode = false;
    this.isSetGridCrossMode = false;
    this.trackingInterval = DEFAULT_ENGINE_VALUE.trackingInterval;
    this.trackingLimit = DEFAULT_ENGINE_VALUE.trackingLimit;
    this.playBackSpeed = DEFAULT_ENGINE_VALUE.playBackSpeed;
    this.worldSize = DEFAULT_ENGINE_VALUE.worldSize;
    this.gravity = DEFAULT_ENGINE_VALUE.gravity;
    this.pps = DEFAULT_ENGINE_VALUE.pps;
    this.friction = DEFAULT_ENGINE_VALUE.friction;

    this.notify();
  }

  public getObjects(): BaseObject[]{
    return this.content.objects;
  }

  public start(): void {
    if(this.isStarted) return;

    this.isStarted = true;

    this.notify();

    this.update();
  }

  public stop(): void {
    this.isStarted = false;

    this.notify();
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

      for(let i = 0;noStopBodies.length > i;i++){
        this.content.addTrackBody(noStopBodies[i]);
      }

      while(this.content.trackBodiesCount > trackingLimit){
        this.content.removeAllTrackBodies();
      }

      this.trackingCount %= this.trackingInterval;
    }

    for(let i = 0;i < this.content.entitiesCount;i++){
      const entity = this.content.entities[i];

      this.updatePosition(entity);
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

      for(let j = i + 1;j < source.connection.targets.length;j++){
        const targetData = source.connection.targets[j];
        const target = this.content.getEntity(targetData.entityId);

        if(target == null){
          source.connection.remove(targetData.entityId);
        }else{
          this.solveConnection(source,target,targetData);
        }
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
        Math.abs(body.position.y) > this.worldSize
      ){
        this.deSpawn(body.id);
      }
    }
  }

  public spawn(option: BaseCreateOption): BaseObject {
    if(Circle.isCircleCreateOption(option)){
      const circle = Circle.create(option);

      this.content.addBody(circle);

      return circle;
    }else if(Line.isLineCreateOption(option)){
      const line = Line.create(option);

      this.content.addGround(line);

      return line;
    }else if(Curve.isCurveCreateOption(option)){
      const curve = Curve.create(option);

      this.content.addGround(curve);

      return curve;
    }

    throw new Error("存在しないオブジェクトタイプです");
  }

  public deSpawn(id: string): void {
    this.content.removeBody(id);
    this.content.removeGround(id);
  }

  public import(saveData: string): void {
    const rawData = JSON.parse(saveData);

    const validData = saveDataSchema.parse(rawData);

    this.stop();

    this.clear(true);

    this.setOption(validData.engine);
    this.viewport.setOption(validData.viewport);

    this.content.setBodies(
      validData.objects.bodies
        .map(body=>{
          if(Circle.isCircleOption(body)){
            return Circle.from(body);
          }

          return null;
        })
        .filter(body=>body != null)
    );

    this.content.setGrounds(
      validData.objects.grounds
      .map(ground=>{
        if(Line.isLineOption(ground)){
          return Line.from(ground);
        }else if(Curve.isCurveOption(ground)){
          return Curve.from(ground);
        }

        return null;
      })
      .filter(ground=>ground != null)
    );
  }

  public export(): string {
    const exportData: SaveData = {
      engine:{
        playBackSpeed: this.playBackSpeed,
        trackingInterval: this.trackingInterval,
        trackingLimit: this.trackingLimit,
        worldSize: this.worldSize,
        pps: this.pps,
        gravity: this.gravity,
        friction: this.friction
      },
      viewport:{
        offset: this.viewport.offset.toJSON(),
        zoomRatio: this.viewport.zoomRatio,
        gridWidth: this.viewport.gridWidth
      },
      objects:{
        bodies: this.content.bodies.map(body=>body.toJSON()),
        grounds: this.content.grounds.map(ground=>ground.toJSON())
      }
    }

    return JSON.stringify(exportData);
  }

  public setOption(option: EngineOption): void {
    this.playBackSpeed = option.playBackSpeed;
    this.trackingInterval = option.trackingInterval;
    this.trackingLimit = option.trackingLimit;
    this.worldSize = option.worldSize;
    this.pps = option.pps;
    this.gravity = option.gravity;
    this.friction = option.friction;

    this.notify();
  }

  public toWorldPosition(target: Vector): Vector{
    if(this.isSetGridCrossMode) {
      target = this.toNearGridCrossPosition(target);
    }

    target.x -= this.viewport.offset.x;
    target.y -= this.viewport.offset.y;

    target.divide(this.viewport.zoomRatio);

    return target;
  }

  public toNearGridCrossPosition(target: Vector): Vector{
    const worldX = target.x / this.viewport.zoomRatio - this.viewport.offset.x / this.viewport.zoomRatio;
    const worldY = target.y / this.viewport.zoomRatio - this.viewport.offset.y / this.viewport.zoomRatio;

    const nearGridWorldX = Math.round(worldX / this.viewport.gridWidth) * this.viewport.gridWidth;
    const nearGridWorldY = Math.round(worldY / this.viewport.gridWidth) * this.viewport.gridWidth;

    const nearGridX = (nearGridWorldX + this.viewport.offset.x / this.viewport.zoomRatio) * this.viewport.zoomRatio;
    const nearGridY = (nearGridWorldY + this.viewport.offset.y / this.viewport.zoomRatio) * this.viewport.zoomRatio;

    return new Vector(nearGridX,nearGridY);
  }
}