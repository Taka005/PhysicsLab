import { ViewportOption } from "../types";
import { Vector } from "./Vector";

export class Viewport{
  public offset: Vector;
  public zoomRatio: number;
  public gridWidth: number;
  public isDisplayVector: boolean = false;
  public isDisplayGrid: boolean = false;

  constructor(option: ViewportOption){
    this.offset = Vector.from(option.offset);
    this.zoomRatio = option.zoomRatio;
    this.gridWidth = option.gridWidth;
  }

  public toJSON(): ViewportOption {
    return {
      offset: this.offset.toJSON(),
      zoomRatio: this.zoomRatio,
      gridWidth: this.gridWidth
    }
  }

  public setOption(option: ViewportOption): void {
    this.offset = Vector.from(option.offset);
    this.zoomRatio = option.zoomRatio;
    this.gridWidth = option.gridWidth;
  }

  public reset(): void{
    this.offset = new Vector(0,0);
    this.zoomRatio = 1;
    this.gridWidth = 50;
    this.isDisplayGrid= false;
    this.isDisplayVector = false;
  }
}