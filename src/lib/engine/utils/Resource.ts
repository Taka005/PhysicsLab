import { ResourceOption } from "../types";

export class Resource{
  private _color: string = "#ff0000";

  constructor(option: ResourceOption){
    this.color = option.color;
  }

  public get color(): string{
    return this._color;
  }

  public set color(value: string){
    const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(value);
    if(isValidColor){
      this._color = value;
    }
  }

  public toJSON(): ResourceOption {
    return {
      color: this.color
    }
  }

  public static from(option: ResourceOption): Resource{
    return new Resource(option);
  }
}