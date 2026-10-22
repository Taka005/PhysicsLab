import { ViewportOption } from "../types";
import { Vector } from "./Vector";

export class Viewport{
  public offset: Vector;
  public zoomRatio: number;
  public _gridWidth: number;
  public _isDisplayVector: boolean = false;
  public _isDisplayGrid: boolean = false;
  private onChanged: () => void;

  constructor(option: ViewportOption,onChanged: () => void){
    this.offset = Vector.from(option.offset);
    this.zoomRatio = option.zoomRatio;
    this._gridWidth = option.gridWidth;
    this.onChanged = onChanged;
  }

  public get isDisplayVector(): boolean{
    return this._isDisplayVector;
  }

  public set isDisplayVector(value: boolean) {
    this._isDisplayVector = value;
    this.onChanged();
  }

  public get isDisplayGrid(): boolean{
    return this._isDisplayGrid;
  }

  public set isDisplayGrid(value: boolean) {
    this._isDisplayGrid = value;
    this.onChanged();
  }

  public get gridWidth(): number{
    return this._gridWidth;
  }

  public set gridWidth(value: number) {
    if(value <= 0) throw new Error("グリッド間隔は0を超える必要があります");

    this._gridWidth = value;
    this.onChanged();
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

    this.onChanged();
  }

  public reset(): void{
    this.offset = new Vector(0,0);
    this.zoomRatio = 1;
    this.gridWidth = 50;
    this.isDisplayGrid= false;
    this.isDisplayVector = false;

    this.onChanged();
  }
}