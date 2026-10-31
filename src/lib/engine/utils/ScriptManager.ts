import { BaseObject } from "../objects/BaseObject";
import { ScriptError, ScriptOption } from "../types";
import { createId } from "./createId";
import { EngineError } from "./EngineError";
import { Script } from "./Script";

export class ScriptManager{
  private _scripts: Script[] = [];
  private globalVarMap = new Map<string, { [key: string]: any }>();
  private listeners = new Set<() => void>();
  private _errors = new Map<string, ScriptError>();
  private errorSnapshot: readonly ScriptError[] = [];

  public get scripts(): Script[]{
    return this._scripts;
  }

  public get errors(): readonly ScriptError[] {
    return this.errorSnapshot;
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

  public getErrorSnapshot = (): readonly ScriptError[] => {
    return this.errorSnapshot;
  };

  public register(name: string, code: string): Script{
    const newScript = Script.from({
      id: createId(10),
      name: name,
      code: code
    });

    this._scripts = [...this._scripts, newScript];

    this.notify();

    return newScript;
  }

  public get(id: string) {
    return this.scripts.find(script=>script.id === id);
  }

  public setScripts(scripts: ScriptOption[]): void{
    const uniqueIds = new Set(scripts);
    if (uniqueIds.size !== scripts.length) throw new EngineError("データ内に重複しているスクリプトIDが存在します");

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

        try {
          script.init(obj, globalVar);
        } catch (error) {
          this.reportError(obj, script, error);
        }
      }

      try {
        script.update(obj, globalVar);
      } catch (error) {
        this.reportError(obj, script, error);
      }
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public update(id: string,name: string,code: string): boolean {
    const script = this.get(id);

    if (!script) return false;

    script.code = code;
    script.name = name;

    this._scripts = [...this._scripts];

    this.notify();

    return true;
  }

   private reportError(
    object: BaseObject,
    script: Script,
    error: unknown
  ): void {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const scriptError: ScriptError = {
      objectId: object.id,
      scriptId: script.id,
      scriptName: script.name,
      errorMessage
    };

    const key = JSON.stringify([
      scriptError.objectId,
      scriptError.scriptId,
      scriptError.scriptName,
      scriptError.errorMessage
    ]);

    if (this._errors.has(key)) return;

    this._errors.set(key, scriptError);
    this.errorSnapshot = [...this._errors.values()];

    this.notify();
  }

  public clearErrors(): void {
    if (this._errors.size === 0) return;

    this._errors.clear();
    this.errorSnapshot = [];

    this.notify();
  }

  public clearErrorsByObject(objectId: string): void {
    this.removeErrors((error) => error.objectId === objectId);
  }

  public clearErrorsByScript(scriptId: string): void {
    this.removeErrors((error) => error.scriptId === scriptId);
  }

  private removeErrors(predicate: (error: ScriptError) => boolean): void {
    let changed = false;

    for (const [key, error] of this._errors) {
      if (!predicate(error)) continue;

      this._errors.delete(key);
      changed = true;
    }

    if (!changed) return;

    this.errorSnapshot = [...this._errors.values()];

    this.notify();
  }

  public remove(id: string): boolean {
    const index = this.scripts.findIndex(script => script.id === id);

    if (index === -1) return false;

    this._scripts = this._scripts.filter((script) => script.id !== id);

    this.clearErrorsByScript(id);

    this.notify();

    return true;
  }

  public removeMap(id: string) {
    this.globalVarMap.delete(id);
  }
}