import { BaseObject } from "../objects/BaseObject";
import { ScriptOption } from "../types";
import { createId } from "./createId";
import { Script } from "./Script";

export class ScriptManager{
  private _scripts: Script[] = [];
  private globalVarMap = new Map<string, { [key: string]: any }>();
  private listeners = new Set<() => void>();

  public get scripts(): Script[]{
    return this._scripts;
  }

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): readonly Script[] => {
    return this.scripts;
  };

  public register(name: string, code: string): Script{
    const newScript = Script.from({
      id: createId(10),
      name: name,
      code: code
    });

    this.scripts.push(newScript);

    this.notify();

    return newScript;
  }

  public get(id: string) {
    return this.scripts.find(script=>script.id === id);
  }

  public setScripts(scripts: ScriptOption[]): void{
    const uniqueIds = new Set(scripts);
    if (uniqueIds.size !== scripts.length) throw new Error("データ内に重複しているスクリプトIDが存在します");

    this._scripts = scripts.map(body=>{
      return Script.from(body);
    });

    this.notify();
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

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public remove(id: string): boolean {
    const index = this.scripts.findIndex(script => script.id === id);

    if (index === -1) return false;

    this.scripts.splice(index, 1);

    this.notify();

    return true;
  }

  public removeMap(id: string) {
    this.globalVarMap.delete(id);
  }
}