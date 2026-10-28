import { ScriptOption } from "../types";
import { createId } from "./createId";
import { Script } from "./Script";

export class ScriptManager{
  public scripts: Script[] = [];

  public register(name: string, code: string) {
    this.scripts.push(Script.from({
      id: createId(12),
      name: name,
      code: code
    }));
  }

  public get(id: string) {
    return this.scripts.find(script=>script.id === id);
  }

  public setScripts(scripts: ScriptOption[]): void{
    this.scripts = scripts.map(body=>{
      return Script.from(body);
    });
  }
}