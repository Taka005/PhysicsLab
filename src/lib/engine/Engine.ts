import { EngineBase } from "./EngineBase";
import { BaseBody } from "./objects/BaseBody";
import { BaseEffect } from "./objects/BaseEffect";
import { BaseGround } from "./objects/BaseGround";
import { BaseObject } from "./objects/BaseObject";
import { Booster } from "./objects/Booster";
import { Circle } from "./objects/Circle";
import { Curve } from "./objects/Curve";
import { Entity } from "./objects/Entity";
import { Line } from "./objects/Line";
import { saveDataSchema } from "./typeSchema";
import { BaseCreateOption, DEFAULT_ENGINE_VALUE, DEFAULT_VIEWPORT_VALUE, GroundEdgeData, EngineOption, EngineSnapShot, SaveData, ViewportOption, EffectEdgeData } from "./types";
import { ContentManager } from "./utils/ContentManager";
import { EngineError } from "./utils/EngineError";
import { ScriptManager } from "./utils/ScriptManager";
import { Vector } from "./utils/Vector";
import { Viewport } from "./utils/Viewport";

export class Engine extends EngineBase {
  private static readonly SAVE_DATA_VERSION: number = 1;

  private static readonly SAMPLE_INTERVAL = 1 / 30;

  public isStarted: boolean = false;

  private _isTrackingMode = false;

  private _isDynamicTrackingMode: boolean = false;

  private _isPredictMode = false;

  private _isSetGridCrossMode: boolean = false;

  private _isDisabledScript: boolean = false;

  private _isDebugMode: boolean = false;

  private _playBackSpeed: number;

  private _trackingInterval: number;

  private _trackingLimit: number;

  private _predictLimit: number;

  private _worldSize: number;

  private _scriptExecuteInterval: number;

  public readonly viewport: Viewport;

  private trackingCount: number = 0;

  private scriptExecuteCount: number = 0;

  private readonly content: ContentManager = new ContentManager();

  public readonly scriptManager: ScriptManager = new ScriptManager(this);

  private listeners = new Set<() => void>();

  private sampleListeners = new Map<(deltaTime: number) => void,{ elapsed: number }>();

  private snapshot: EngineSnapShot;

  constructor(engineOption: EngineOption = DEFAULT_ENGINE_VALUE,viewportOption: ViewportOption = DEFAULT_VIEWPORT_VALUE) {
    super(engineOption,() => this.notify());

    this.viewport = new Viewport(viewportOption,() => this.notify());

    this._playBackSpeed = engineOption.playBackSpeed;
    this._trackingInterval = engineOption.trackingInterval;
    this._trackingLimit = engineOption.trackingLimit;
    this._predictLimit = engineOption.predictLimit;
    this._worldSize = engineOption.worldSize;
    this._scriptExecuteInterval = engineOption.scriptExecuteInterval;

    this.content.setTrackBodiesCapacity(this.trackingLimit);

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

  public get isPredictMode(): boolean {
    return this._isPredictMode;
  }

  public set isPredictMode(value: boolean) {
    this._isPredictMode = value;
    this.notify();
  }

  public get isSetGridCrossMode(): boolean{
    return this._isSetGridCrossMode;
  }

  public set isSetGridCrossMode(value: boolean) {
    this._isSetGridCrossMode = value;
    this.notify();
  }

  public get isDisabledScript(): boolean{
    return this._isDisabledScript;
  }

  public set isDisabledScript(value: boolean) {
    this._isDisabledScript = value;
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
    if(value <= 0) throw new EngineError("再生速度は0を超える必要があります");

    this._playBackSpeed = value;
    this.notify();
  }

  public get trackingInterval(): number{
    return this._trackingInterval;
  }

  public set trackingInterval(value: number) {
    if(value <= 0||!Number.isInteger(value)) throw new EngineError("トラッキング間隔は0を超え、整数である必要があります");

    this._trackingInterval = value;
    this.notify();
  }

  public get trackingLimit(): number{
    return this._trackingLimit;
  }

  public set trackingLimit(value: number) {
    if(value <= 0||!Number.isInteger(value)) throw new EngineError("最大トラッキング数は0を超え、整数である必要があります");

    this._trackingLimit = value;

    this.content.setTrackBodiesCapacity(value);

    this.notify();
  }

  public get predictLimit(): number {
    return this._predictLimit;
  }

  public set predictLimit(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new EngineError("最大予測数は0を超える必要があります");
    }

    this._predictLimit = value;
    this.notify();
  }

  public get scriptExecuteInterval(): number{
    return this._scriptExecuteInterval;
  }

  public set scriptExecuteInterval(value: number) {
    if(value <= 0||!Number.isInteger(value)) throw new EngineError("スクリプト実行間隔は0を超え、整数である必要があります");

    this._scriptExecuteInterval = value;
    this.notify();
  }

  public get worldSize(): number{
    return this._worldSize;
  }

  public set worldSize(value: number) {
    if(value <= 0||!Number.isInteger(value)) throw new EngineError("ワールドサイズは0を超え、整数である必要があります");

    this._worldSize = value;
    this.notify();
  }

  private createSnapshot(): EngineSnapShot{
    return {
      isStarted: this.isStarted,
      isTrackingMode: this.isTrackingMode,
      isDynamicTrackingMode: this.isDynamicTrackingMode,
      isPredictMode: this.isPredictMode,
      isDebugMode: this.isDebugMode,
      isSetGridCrossMode: this.isSetGridCrossMode,
      isDisabledScript: this.isDisabledScript,
      isDisplayGrid: this.viewport.isDisplayGrid,
      isDisplayVector: this.viewport.isDisplayVector,
      isDisplayConnection: this.viewport.isDisplayConnection,
      isDisplayEdge: this.viewport.isDisplayEdge,
      isHiddenBody: this.viewport.isHiddenBody,
      isHiddenEffect: this.viewport.isHiddenEffect,
      isHiddenGround: this.viewport.isHiddenGround,
      playBackSpeed: this.playBackSpeed,
      worldSize: this.worldSize,
      trackingInterval: this.trackingInterval,
      trackingLimit: this.trackingLimit,
      predictLimit: this.predictLimit,
      scriptExecuteInterval: this.scriptExecuteInterval,
      gridWidth: this.viewport.gridWidth,
      gravity: this.gravity,
      pps: this.pps,
      friction: this.friction,
      bodiesCount: this.content.bodiesCount,
      groundsCount: this.content.groundsCount,
      effectsCount: this.content.effectsCount,
      entitiesCount: this.content.entitiesCount
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

  public subscribeSample = (listener: (deltaTime: number) => void) => {
    this.sampleListeners.set(listener, { elapsed: 0 });

    return () => {
      this.sampleListeners.delete(listener);
    };
  };

  public reset(): void{
    this.viewport.reset();

    this.isTrackingMode = false;
    this.isDynamicTrackingMode = false;
    this.isPredictMode = false;
    this.isDebugMode = false;
    this.isSetGridCrossMode = false;
    this.isDisabledScript = false;
    this.trackingInterval = DEFAULT_ENGINE_VALUE.trackingInterval;
    this.trackingLimit = DEFAULT_ENGINE_VALUE.trackingLimit;
    this.predictLimit = DEFAULT_ENGINE_VALUE.predictLimit;
    this.scriptExecuteInterval = DEFAULT_ENGINE_VALUE.scriptExecuteInterval;
    this.playBackSpeed = DEFAULT_ENGINE_VALUE.playBackSpeed;
    this.worldSize = DEFAULT_ENGINE_VALUE.worldSize;
    this.gravity = DEFAULT_ENGINE_VALUE.gravity;
    this.pps = DEFAULT_ENGINE_VALUE.pps;
    this.friction = DEFAULT_ENGINE_VALUE.friction;

    this.notify();
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
      this.content.removeAllEffects();
      this.content.removeAllGrounds();
      this.content.removeAllTrackBodies();
    }

    this.notify();
  }

  public clearTrack(): void{
    this.content.removeAllTrackBodies();
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
      if(trackingLimit <= 0){
        this.content.removeAllTrackBodies();
      }else{
        for(let i = 0;i < this.content.bodiesCount;i++){
          const body = this.content.bodies[i];

          if(!body.isStop){
            this.content.addTrackBody(body.clone());
          }
        }
      }

      this.trackingCount %= this.trackingInterval;
    }

    if(!this.isDisabledScript){
      this.scriptExecuteCount += 1000/this.pps;

      if(this.scriptExecuteCount >= this.scriptExecuteInterval){
        this.scriptManager.updateAll(this.content.objects);

        this.scriptExecuteCount %= this.scriptExecuteInterval;
      }
    }

    for(let i = 0;i < this.content.entitiesCount;i++){
      const entity = this.content.entities[i];

      for (let i = 0; i < this.content.effectsCount; i++) {
        const effect = this.content.effects[i];

        effect.setEffect(entity,this.deltaTime);
      }

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

      for(let j = 0;j < source.connection.targets.length;j++){
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
        Math.abs(body.position.x) >= this.worldSize||
        Math.abs(body.position.y) >= this.worldSize
      ){
        this.deSpawn(body.id);
      }
    }

    if (this.sampleListeners.size > 0) {
      for (const [listener, sample] of this.sampleListeners) {
        sample.elapsed += this.deltaTime;

        if (sample.elapsed >= Engine.SAMPLE_INTERVAL) {
          const elapsed = sample.elapsed;
          sample.elapsed %= Engine.SAMPLE_INTERVAL;
          listener(elapsed);
        }
      }
    }
  }

  public spawn(option: BaseCreateOption): BaseObject {
    if(
      option.scriptId !== null&&
      !this.scriptManager.get(option.scriptId)
    ) throw new EngineError("存在しないスクリプトを設定しています");

    if(Circle.isCircleCreateOption(option)){
      const circle = Circle.create(option);

      this.content.addBody(circle);

      this.notify();

      return circle;
    }else if(Line.isLineCreateOption(option)){
      const line = Line.create(option);

      this.content.addGround(line);

      this.notify();

      return line;
    }else if(Curve.isCurveCreateOption(option)){
      const curve = Curve.create(option);

      this.content.addGround(curve);

      this.notify();

      return curve;
    }else if(Booster.isBoosterCreateOption(option)){
      const booster = Booster.create(option);

      this.content.addEffect(booster);

      this.notify();

      return booster;
    }

    throw new EngineError("存在しないオブジェクトタイプです");
  }

  public deSpawn(id: string): void {
    this.content.removeBody(id);
    this.content.removeGround(id);
    this.content.removeEffect(id);
    this.scriptManager.removeMap(id);
    this.scriptManager.clearErrorsByObject(id);

    this.notify();
  }

  public getObjects(): BaseObject[]{
    return this.content.objects;
  }

  public getTrackBodies(): BaseBody[]{
    return this.content.getTrackBodies();
  }

  public getPredictBodies(): BaseBody[] {
    const trackBodies: BaseBody[] = [];
    const duration = this.predictLimit*(this.trackingInterval/1000);

    for (const body of this.content.bodies) {
      for (let i = 1; i <= this.predictLimit; i++) {
        const time = Math.min(i * (this.trackingInterval/1000), duration);
        const predictedBody = body.clone();

        for (let j = 0; j < body.entities.length; j++) {
          const entity = body.entities[j];
          const predictedEntity = predictedBody.entities[j];
          const gravity = entity.mass === 0 ? 0 : this.gravity;
          predictedEntity.position = new Vector(
            entity.position.x + entity.velocity.x * time,
            entity.position.y + entity.velocity.y * time + 0.5 * gravity * time * time
          );
        }

        trackBodies.push(predictedBody);
      }
    }

    return trackBodies;
  }

  public getObject(id: string): BaseObject | undefined{
    return this.content.getObject(id);
  }

  public getEntity(id: string): Entity | undefined {
    return this.content.getEntity(id);
  }

  public getBodiesAt(target: Vector): BaseBody[]{
    const bodies: BaseBody[] = [];

    for (let i = 0; i < this.content.bodiesCount; i++) {
      const body = this.content.bodies[i];

      const entities = body.entities.filter(entity=>{
        const diff = Vector.subtract(entity.position,target);

        const distance = diff.distance();

        return distance <= entity.radius;
      });

      if(entities.length == 0) continue;

      bodies.push(body);
    }

    return bodies;
  }

  public getGroundsAt(target: Vector): BaseGround[]{
    const grounds: BaseGround[] = [];

    for (let i = 0; i < this.content.groundsCount; i++) {
      const ground = this.content.grounds[i];

      const cross = ground.solvePosition(target);

      const diff = Vector.subtract(cross,target);

      const distance = diff.distance();

      if(distance > ground.width / 2) continue;

      grounds.push(ground);
    }

    return grounds;
  }

  public getEffectsAt(target: Vector): BaseEffect[]{
    const effects: BaseEffect[] = [];

    for (let i = 0; i < this.content.effectsCount; i++) {
      const effect = this.content.effects[i];
      if(effect instanceof Booster){
        const diff = Vector.subtract(target,Vector.add(effect.start,effect.end).divide(2));

        if(
          Math.abs(diff.x) >= Math.abs(effect.start.x - effect.end.x)/2||
          Math.abs(diff.y) >= Math.abs(effect.start.y - effect.end.y)/2
        ) continue;

        effects.push(effect);
      }
    }

    return effects;
  }

  public getEntitiesAt(target: Vector): Entity[]{
    const entities: Entity[] = [];

    for (let i = 0; i < this.content.entitiesCount; i++) {
      const entity = this.content.entities[i];

      const diff = Vector.subtract(entity.position,target);

      const distance = diff.distance();

      if(distance > entity.radius) continue;

      entities.push(entity);
    }

    return entities;
  }

  public getGroundsEdgeAt(target: Vector): GroundEdgeData[]{
    const edges: GroundEdgeData[] = [];

    for (let i = 0; i < this.content.groundsCount; i++) {
      const ground = this.content.grounds[i];

      if(ground instanceof Line){
        const diffStart = Vector.subtract(ground.start,target);
        const diffEnd = Vector.subtract(ground.end,target);

        const distanceStart = diffStart.distance();
        const distanceEnd = diffEnd.distance();

        if(distanceStart <= ground.width / 2){
          edges.push({
            type: "start",
            ground: ground
          });
        }else if(distanceEnd <= ground.width / 2){
          edges.push({
            type: "end",
            ground: ground
          });
        }
      }else if(ground instanceof Curve){
        const diffStart = Vector.subtract(ground.start,target);
        const diffMiddle = Vector.subtract(ground.middle,target);
        const diffEnd = Vector.subtract(ground.end,target);

        const distanceStart = diffStart.distance();
        const distanceMiddle = diffMiddle.distance();
        const distanceEnd = diffEnd.distance();

        if(distanceStart <= ground.width / 2){
          edges.push({
            type: "start",
            ground: ground
          });
        }else if(distanceMiddle <= ground.width / 2){
          edges.push({
            type: "middle",
            ground: ground
          });
        }else if(distanceEnd <= ground.width / 2){
          edges.push({
            type: "end",
            ground: ground
          });
        }
      }
    }

    return edges;
  }

  public getEffectsEdgeAt(target: Vector): EffectEdgeData[]{
    const edges: EffectEdgeData[] = [];

    for (let i = 0; i < this.content.effectsCount; i++) {
      const effect = this.content.effects[i];

      if(effect instanceof Booster){
        const diffStart = Vector.subtract(effect.start,target);
        const diffEnd = Vector.subtract(effect.end,target);

        const distanceStart = diffStart.distance();
        const distanceEnd = diffEnd.distance();

        if(distanceStart <= 2){
          edges.push({
            type: "start",
            effect: effect
          });
        }else if(distanceEnd <= 2){
          edges.push({
            type: "end",
            effect: effect
          });
        }
      }
    }

    return edges;
  }

  public parseValidData(saveData: string){
    const rawData = JSON.parse(saveData);

    return saveDataSchema.parse(rawData);
  }

  public import(saveData: string): void {
    const validData = this.parseValidData(saveData);

    if(validData.version !== Engine.SAVE_DATA_VERSION) throw new EngineError("セーブデータのバージョンが違います");

    const allIds = [
      ...validData.objects.bodies.map(body=>body.id),
      ...validData.objects.grounds.map(ground=>ground.id),
      ...validData.objects.effects.map(effect=>effect.id)
    ];

    const uniqueIds = new Set(allIds);
    if (uniqueIds.size !== allIds.length) throw new EngineError("セーブデータ内に重複している物体IDが存在します");

    this.stop();

    this.clear(true);

    this.setOption(validData.engine);
    this.viewport.setOption(validData.viewport);

    this.scriptManager.setScripts(validData.scripts);

    this.content.setBodies(validData.objects.bodies);

    this.content.setGrounds(validData.objects.grounds);

    this.content.setEffects(validData.objects.effects);

    this.notify();
  }

  public export(): string {
    const exportData: SaveData = {
      version: Engine.SAVE_DATA_VERSION,
      engine:{
        playBackSpeed: this.playBackSpeed,
        trackingInterval: this.trackingInterval,
        trackingLimit: this.trackingLimit,
        predictLimit: this.predictLimit,
        scriptExecuteInterval: this.scriptExecuteInterval,
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
      scripts: this.scriptManager.scripts.map(script=>script.toJSON()),
      objects:{
        bodies: this.content.bodies.map(body=>body.toJSON()),
        grounds: this.content.grounds.map(ground=>ground.toJSON()),
        effects: this.content.effects.map(effect=>effect.toJSON())
      }
    }

    return JSON.stringify(exportData);
  }

  public setOption(option: EngineOption): void {
    this.playBackSpeed = option.playBackSpeed;
    this.trackingInterval = option.trackingInterval;
    this.trackingLimit = option.trackingLimit;
    this.predictLimit = option.predictLimit;
    this.scriptExecuteInterval = option.scriptExecuteInterval;
    this.worldSize = option.worldSize;
    this.pps = option.pps;
    this.gravity = option.gravity;
    this.friction = option.friction;

    this.notify();
  }

  public toWorldPosition(target: Vector,disableGrid: boolean = false): Vector{
    let worldX = (target.x - this.viewport.offset.x) / this.viewport.zoomRatio;
    let worldY = (target.y - this.viewport.offset.y) / this.viewport.zoomRatio;

    if (this.isSetGridCrossMode&&!disableGrid) {
      worldX = Math.round(worldX / this.viewport.gridWidth) * this.viewport.gridWidth;
      worldY = Math.round(worldY / this.viewport.gridWidth) * this.viewport.gridWidth;
    }

    return new Vector(worldX, worldY);
  }
}