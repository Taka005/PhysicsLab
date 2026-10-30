import { BaseObject } from "../objects/BaseObject";
import { ScriptOption } from "../types";
import { createId } from "./createId";
import { Script } from "./Script";

export class ScriptManager{
  public scripts: Script[] = [];
  private globalVarMap = new Map<string, { [key: string]: any }>();

  public register(name: string, code: string): Script{
    const newScript = Script.from({
      id: createId(10),
      name: name,
      code: code
    });

    this.scripts.push(newScript);

    return newScript;
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

  public remove(id: string): boolean {
    const index = this.scripts.findIndex(script => script.id === id);

    if (index === -1) return false;

    this.scripts.splice(index, 1);

    return true;
  }

  public removeMap(id: string) {
    this.globalVarMap.delete(id);
  }
}