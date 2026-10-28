import { generateAst, transpiler } from "@/lib/script";
import { ScriptOption, TranspiledScript } from "../types";
import { BaseObject } from "../objects/BaseObject";

export class Script{
  public id: string;
  public name: string;
  private _code: string;
  private build: TranspiledScript;
  private globalVariables: { [key: string]: any } = {};

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

  public init(target: BaseObject): void{
    this.build.init(target,this.globalVariables);
  }

  public update(target: BaseObject): void{
    this.build.update(target,this.globalVariables);
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
}