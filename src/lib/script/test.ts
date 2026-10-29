import { generateAst } from "./parser/ast";
import { transpiler } from "./Transpiler";

const code = `
  init {
    t = 10;
    x = 0;
  }

  update {
    if (!t){
    t += 1;
      a = 1
    }else{
      console("A");
    }

    t = sin(max(startY,startX) * 0.05) * PI;

    obj.start.Y += t;
    endY += t;
    obj = 1;
    console("obj.start.Y");
  }
`;

try {
  const ast = generateAst(code);

  const javascript = transpiler.transpile(ast);
  console.log(javascript);
} catch (error) {
  console.error("予期せぬエラー:", error);
}