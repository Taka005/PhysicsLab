import { parser } from "./parser";
import { ScriptSyntaxError } from "./ScriptSyntaxError";
import { ScriptLexer } from "./tokens";
import { ProgramNode } from "./types";
import { astVisitor } from "./visitor";

const code = `
  init {
    t = 10;
    x = 0;
  }

  update {
    if (t > 5) {
      t += 1;
    }

    t = sin(startY * 0.05) * PI;

    startY += t;
    endY += t;
  }
`;

try {
  const ast = parse(code);

  console.log(
    "パース成功:",
    JSON.stringify(ast, null, 2),
  );
} catch (error) {
  if (error instanceof ScriptSyntaxError) {
    console.error(
      `構文エラー (行: ${error.line}, 列: ${error.column}):`,
      error.message,
    );
  } else {
    console.error("予期せぬエラー:", error);
  }
}

export function parse(source: string): ProgramNode {
  const lexResult = ScriptLexer.tokenize(source);

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

  return astVisitor.visit(cst) as ProgramNode;
}