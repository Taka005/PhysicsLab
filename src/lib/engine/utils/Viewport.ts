import { DEFAULT_VIEWPORT_VALUE, ViewportOption } from "../types";
import { Vector } from "./Vector";

export class Viewport{
  private _offset: Vector;
  private _zoomRatio: number;
  private _gridWidth: number;
  private _isDisplayVector: boolean = false;
  private _isDisplayGrid: boolean = false;
  private onChanged: () => void;

  constructor(option: ViewportOption,onChanged: () => void){
    this._offset = Vector.from(option.offset);
    this._zoomRatio = option.zoomRatio;
    this._gridWidth = option.gridWidth;
    this.onChanged = onChanged;
  }

  public get offset(): Vector{
    return this._offset;
  }

  public set offset(value: Vector) {
    this._offset = value;
    this.onChanged();
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

  public get zoomRatio(): number{
    return this._zoomRatio;
  }

  public set zoomRatio(value: number) {
    if(value <= 0) throw new Error("拡大倍率は0を超える必要があります");

    this._zoomRatio = value;
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
    this.offset = Vector.from(DEFAULT_VIEWPORT_VALUE.offset);
    this.zoomRatio = DEFAULT_VIEWPORT_VALUE.zoomRatio;
    this.gridWidth = DEFAULT_VIEWPORT_VALUE.gridWidth;
    this.isDisplayGrid= false;
    this.isDisplayVector = false;

    this.onChanged();
  }
}