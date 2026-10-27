import { transpileToJavaScript } from "./Compiler";
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
    }

    t = sin(startY * 0.05) * PI;

    obj.start.Y += t;
    endY += t;
  }
`;

try {
  const ast = generateAst(code);

  const javascript = transpileToJavaScript(ast, {
    selfProperties: [
      "startY",
      "endY",
    ],
    envProperties: [
      "t",
    ],
  });

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
