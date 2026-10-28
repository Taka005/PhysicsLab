import { generateAst, transpiler } from "@/lib/script";
import { ScriptOption, TranspiledScript } from "../types";
import { BaseObject } from "../objects/BaseObject";

export class Script{
  public id: string;
  public name: string;
  private _code: string;
  private build: TranspiledScript;

  constructor(option: ScriptOption){
    this.id = option.id;
    this.name = option.name;
    this._code = option.code;
    this.build = this.transpileScript(this.code);
  }

  public get code(): string{
    return this._code;
  }

  public set code(value: string){
    this._code = value;
    this.build = this.transpileScript(this.code);
  }

  public init(target: BaseObject,globalVar: { [key: string]: any }): void{
    this.build.init(target,globalVar);
  }

  public update(target: BaseObject, globalVar: { [key: string]: any }): void{
    this.build.update(target,globalVar);
  }

  private transpileScript(code: string): TranspiledScript {
    try{
      const ast = generateAst(code);

      const factory = new Function(transpiler.transpile(ast));

      return factory() as TranspiledScript;
    }catch(error){
      throw error;
    }
  }

  public toJSON(): ScriptOption{
    return {
      id: this.id,
      name: this.name,
      code: this.code
    }
  }

  public static from(option: ScriptOption): Script{
    return new Script(option);
  }
}