import { parser } from "./parser";
import { ScriptSyntaxError } from "./ScriptSyntaxError";
import { scriptLexer } from "./tokens";
import { ProgramNode } from "../types";
import { visitor } from "./visitor";

export function generateAst(source: string): ProgramNode {
  const lexResult = scriptLexer.tokenize(source);

  if (lexResult.errors.length > 0) {
    const error = lexResult.errors[0];

    throw new ScriptSyntaxError(
      error.message,
      error.line ?? 0,
      error.column ?? 0,
    );
  }

  parser.input = lexResult.tokens;

  const cst = parser.program();

  if (parser.errors.length > 0) {
    const error = parser.errors[0];
    const token = error.token;

    throw new ScriptSyntaxError(
      error.message,
      token.startLine ?? 0,
      token.startColumn ?? 0,
    );
  }

  return visitor.visit(cst) as ProgramNode;
}