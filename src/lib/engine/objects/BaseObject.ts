import { BaseObjectOption } from "../types";
import { Resource } from "../utils/Resource";

export class BaseObject{
  public id: string;
  public resource: Resource;

  constructor(option: BaseObjectOption){
    this.id = option.id;
    this.resource = Resource.from(option.resource);
  }
}