import { transpiler } from "./Transpiler";
import { generateAst } from "./parser/ast";
import { ScriptSyntaxError } from "./parser/ScriptSyntaxError";

const code = `
  init {
    t = 10;
    x = 0;
  }

  update {
    if (t > 5) {
      t += 1;
      a = 1
    }

    t = sin(max(startY,startX) * 0.05) * PI;

    obj.start.Y += t;
    endY += t;
    obj = 1;
  }
`;

try {
  const ast = generateAst(code);

  const javascript = transpiler.transpile(ast);
  console.log(javascript);
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
