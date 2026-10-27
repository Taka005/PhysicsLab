import { generateAst, transpiler } from "@/lib/script";
import { ScriptOption, TranspiledScript } from "../types";
import { BaseObject } from "../objects/BaseObject";

export class Script{
  private target: BaseObject;
  private _code: string;
  private build: TranspiledScript;
  private globalVariables: { [key: string]: any } = {};

  constructor(option: ScriptOption){
    this._code = option.code;
    this.target = option.target;
    this.build = this.transpileScript(this.code);
    this.build.init(this.target,this.globalVariables);
  }

  public get code(): string{
    return this._code;
  }

  public set code(value: string){
    this._code = value;
    this.build = this.transpileScript(this.code);
    this.build.init(this.target,this.globalVariables);
  }

  public update(): void{
    this.build.update(this.target,this.globalVariables);
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