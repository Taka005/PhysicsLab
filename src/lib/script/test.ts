import { generateAst } from "./parser/ast";
import { transpiler } from "./Transpiler";

const code = `
init {
  t = 0.3;
  target = find("g1");
  flag = false;
  initFlag = true;
}

update {

  if(initFlag){
    if(obj.start.y > 480){
      initFlag = false;
    }

      t = 0.3;

      obj.start.y += t;
      obj.end.y += t;
  }else{
  if(exist(target)){
    if(flag){
      if(obj.start.y < 440){
      t = 0.3;
      }

      obj.start.y += t;
      obj.end.y += t;

      if(obj.start.y > 480){
        flag = false;
      }
    }else{
      if(distance(obj.start,target.start) < 10){
        flag = true;
        t = -0.3;
      }
    }
  }

  }
}
`;

try {
  const ast = generateAst(code);

  const javascript = transpiler.transpile(ast);
  console.log(javascript);
} catch (error) {
  console.error("予期せぬエラー:", error);
}