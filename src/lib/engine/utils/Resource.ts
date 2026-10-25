export class Resource{
  private _color: string;

  constructor(color: string){
    this._color = color;
  }

  public get color(): string{
    return this._color;
  }

  public set color(value: string){
    const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(value);
    if(isValidColor){
      this._color = value;
    }else{
      this._color = "#000000";
    }
  }
}