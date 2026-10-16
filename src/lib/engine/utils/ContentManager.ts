import { BaseBody } from "../objects/BaseBody";
import { BaseGround } from "../objects/BaseGround";
import { BaseObject } from "../objects/BaseObject";
import { Entity } from "../objects/Entity";

export class ContentManager {
  public bodies: BaseBody[] = [];
  public grounds: BaseGround[] = [];
  public trackBodies: BaseBody[] = [];
  private cacheEntities: Entity[] | null = [];

  public get objects(): BaseObject[]{
    return [...this.bodies,...this.grounds];
  }

  public get bodiesCount(): number {
    return this.bodies.length;
  }

  public get groundsCount(): number {
    return this.grounds.length;
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

  private isExistedId(id: string): boolean {
    return (
      this.getBody(id) != null||
      this.getGround(id) != null
    );
  }

  public getBody(id: string): BaseBody | undefined {
    this.cacheEntities = null;

    return this.bodies.find(body => body.id === id);
  }

  public getGround(id: string): BaseGround | undefined {
    return this.grounds.find(ground => ground.id === id);
  }

  public addBody(body: BaseBody): void {
    if (this.isExistedId(body.id)) throw new Error("既に存在するIDが指定されています");

    this.bodies.push(body);
  }

  public addGround(ground: BaseGround): void {
    if (this.isExistedId(ground.id)) throw new Error("既に存在するIDが指定されています");

    this.grounds.push(ground);
  }

  public addTrackBody(body: BaseBody): void {
    this.trackBodies.push(body);
  }

  public removeBody(id: string): void {
    this.bodies = this.bodies.filter(body => body.id !== id);
  }

  public removeGround(id: string): void {
    this.grounds = this.grounds.filter(ground => ground.id !== id);
  }

  public removeFirstTrackBody(){
    this.trackBodies.shift();
  }

  public removeAllBodies(){
    this.bodies = [];
  }

  public removeAllGrounds(){
    this.grounds = [];
  }

  public removeAllTrackBodies(){
    this.trackBodies = [];
  }
}