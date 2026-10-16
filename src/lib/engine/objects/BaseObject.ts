import { BaseObjectOption } from "../types";

export class BaseObject{
  public id: string;

  constructor(option: BaseObjectOption){
    this.id = option.id;
  }
}