import { ViewportOption } from "../types";
import { Vector } from "./Vector";

export class Viewport{
  public offset: Vector;
  public zoomRatio: number;

  constructor(option: ViewportOption){
    this.offset = Vector.from(option.offset);
    this.zoomRatio = option.zoomRatio;
  }

  public toJSON(): ViewportOption {
    return {
      offset: this.offset.toJSON(),
      zoomRatio: this.zoomRatio
    }
  }

  public setOption(option: ViewportOption): void {
    this.offset = Vector.from(option.offset);
    this.zoomRatio = option.zoomRatio;
  }
}