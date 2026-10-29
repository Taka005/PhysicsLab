import { BaseObject } from "../objects/BaseObject";
import { ScriptOption } from "../types";
import { createId } from "./createId";
import { Script } from "./Script";

export class ScriptManager{
  public scripts: Script[] = [];
  private globalVarMap = new Map<string, { [key: string]: any }>();

  public register(id: string, name: string, code: string) {
    this.scripts.push(Script.from({
      id: id,
      name: name,
      code: code
    }));
  }

  public get(id: string) {
    return this.scripts.find(script=>script.id === id);
  }

  public setScripts(scripts: ScriptOption[]): void{
    const uniqueIds = new Set(scripts);
    if (uniqueIds.size !== scripts.length) throw new Error("データ内に重複しているスクリプトIDが存在します");

    this.scripts = scripts.map(body=>{
      return Script.from(body);
    });
  }

  public updateAll(objects: BaseObject[]) {
    for (const obj of objects) {
      const scriptId = obj.scriptId;
      if (!scriptId) continue;

      const script = this.get(scriptId);
      if (!script) continue;

      let globalVar = this.globalVarMap.get(obj.id);
      if (!globalVar) {
        globalVar = {}
        this.globalVarMap.set(obj.id, globalVar);

        script.init(obj, globalVar);
      }

      script.update(obj, globalVar);
    }
  }

  public removeObject(id: string) {
    this.globalVarMap.delete(id);
  }
}