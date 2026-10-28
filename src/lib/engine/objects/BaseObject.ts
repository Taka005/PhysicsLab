import { BaseObjectOption, ObjectType } from "../types";
import { Resource } from "../utils/Resource";

export class BaseObject{
  public id: string;
  public type: ObjectType;
  public resource: Resource;
  public scriptId: string | null;

  constructor(option: BaseObjectOption){
    this.id = option.id;
    this.type = option.type;
    this.resource = Resource.from(option.resource);
    this.scriptId = option.scriptId;
  }
}