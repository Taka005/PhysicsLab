import { Engine } from "../Engine";
import { BaseObject } from "../objects/BaseObject";
import { Vector } from "./Vector";

export class ScriptFunction{
  private engine: Engine;

  constructor(engine: Engine){
    this.engine = engine;
  }

  public find(id: string): BaseObject | null{
    return this.engine.getObject(id) ?? null;
  }

  public exist(data: string | BaseObject): boolean{
    if(data instanceof BaseObject){
      return !!this.engine.getObject(data.id);
    }else{
      return !!this.engine.getObject(data);
    }
  }

  public distance(a: Vector,b: Vector){
    const diffX = a.x - b.x;
    const diffY = a.y - b.y;

    return Math.sqrt(diffX*diffX+diffY*diffY);
  }

  public destroy(data: string | BaseObject): void{
    if(data instanceof BaseObject){
      this.engine.deSpawn(data.id);
    }else{
      this.engine.deSpawn(data);
    }
  }
}