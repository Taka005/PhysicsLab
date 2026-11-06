import { BaseBody } from "../objects/BaseBody";
import { BaseEffect } from "../objects/BaseEffect";
import { BaseGround } from "../objects/BaseGround";
import { BaseObject } from "../objects/BaseObject";
import { Booster } from "../objects/Booster";
import { Circle } from "../objects/Circle";
import { Curve } from "../objects/Curve";
import { Entity } from "../objects/Entity";
import { Line } from "../objects/Line";
import { BaseBodyOption, BaseEffectOption, BaseGroundOption } from "../types";
import { EngineError } from "./EngineError";

export class ContentManager {
  public bodies: BaseBody[] = [];
  public grounds: BaseGround[] = [];
  public effects: BaseEffect[] = [];
  public trackBodies: BaseBody[] = [];
  private cacheEntities: Entity[] | null = null;
  private cacheObjects: BaseObject[] | null = null;

  public get objects(): BaseObject[] {
    if (this.cacheObjects !== null) return this.cacheObjects;

    this.cacheObjects = [...this.bodies, ...this.grounds,...this.effects];

    return this.cacheObjects;
  }

  public get bodiesCount(): number {
    return this.bodies.length;
  }

  public get groundsCount(): number {
    return this.grounds.length;
  }

  public get effectsCount(): number {
    return this.effects.length;
  }

  public get trackBodiesCount(): number {
    return this.trackBodies.length;
  }

  public get entitiesCount(): number {
    return this.entities.length;
  }

  public get entities(): Entity[] {
    if(this.cacheEntities != null) return this.cacheEntities;

    this.cacheEntities = this.bodies.map(body=>body.entities).flat();

    return this.cacheEntities;
  }

  public setBodies(bodies: BaseBodyOption[]) {
    this.bodies = bodies
      .map(body=>{
        if(Circle.isCircleOption(body)){
          return Circle.from(body);
        }

        return null;
      })
      .filter(body=>body != null)

    this.cacheEntities = null;
    this.cacheObjects = null;
  }

  public setGrounds(grounds: BaseGroundOption[]) {
    this.grounds = grounds
      .map(ground=>{
        if(Line.isLineOption(ground)){
          return Line.from(ground);
        }else if(Curve.isCurveOption(ground)){
          return Curve.from(ground);
        }

        return null;
      })
      .filter(ground=>ground != null);

    this.cacheObjects = null;
  }

  public setEffects(effects: BaseEffectOption[]) {
    this.effects = effects
      .map(effect=>{
        if(Booster.isBoosterOption(effect)){
          return Booster.from(effect);
        }

        return null;
      })
      .filter(effect=>effect != null);

    this.cacheObjects = null;
  }

  public getEntity(id: string): Entity | undefined{
    return this.entities.find(entity => entity.id === id);
  }

  private isExistedId(id: string): boolean {
    return (
      this.getBody(id) != null||
      this.getGround(id) != null||
      this.getEffect(id) != null
    );
  }

  public getBody(id: string): BaseBody | undefined {
    const body = this.bodies.find(body => body.id === id);

    return body;
  }

  public getGround(id: string): BaseGround | undefined {
    const ground = this.grounds.find(ground => ground.id === id);

    return ground;
  }

  public getEffect(id: string): BaseEffect | undefined {
    const effect = this.effects.find(effect => effect.id === id);

    return effect;
  }

  public addBody(body: BaseBody): void {
    if (this.isExistedId(body.id)) throw new EngineError("既に存在するIDが指定されています");

    this.bodies.push(body);

    this.cacheEntities = null;
    this.cacheObjects = null;
  }

  public addGround(ground: BaseGround): void {
    if (this.isExistedId(ground.id)) throw new EngineError("既に存在するIDが指定されています");

    this.grounds.push(ground);

    this.cacheObjects = null;
  }

  public addEffect(effect: BaseEffect): void {
    if (this.isExistedId(effect.id)) throw new EngineError("既に存在するIDが指定されています");

    this.effects.push(effect);

    this.cacheObjects = null;
  }

  public addTrackBody(body: BaseBody): void {
    this.trackBodies.push(body);
  }

  public removeBody(id: string): void {
    this.bodies = this.bodies.filter(body => body.id !== id);

    this.cacheEntities = null;
    this.cacheObjects = null;
  }

  public removeGround(id: string): void {
    this.grounds = this.grounds.filter(ground => ground.id !== id);

    this.cacheObjects = null;
  }

  public removeEffect(id: string): void {
    this.effects = this.effects.filter(effect => effect.id !== id);

    this.cacheObjects = null;
  }

  public removeFirstTrackBody(){
    this.trackBodies.shift();
  }

  public removeAllBodies(){
    this.bodies = [];

    this.cacheEntities = null;
    this.cacheObjects = null;
  }

  public removeAllGrounds(){
    this.grounds = [];

    this.cacheObjects = null;
  }

  public removeAllEffects(){
    this.effects = [];

    this.cacheObjects = null;
  }

  public removeAllTrackBodies(){
    this.trackBodies = [];
  }
}