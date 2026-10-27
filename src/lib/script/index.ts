import { parse } from "./ast";
import { ScriptSyntaxError } from "./ScriptSyntaxError";

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
