// transpiler.ts
import type {
  AssignmentNode,
  ExpressionNode,
  FunctionCallNode,
  IdentifierNode,
  IfStatementNode,
  ProgramNode,
  StatementNode,
} from "./parser/types";

interface TranspileOptions {
  /** self が持つプロパティ名 */
  selfProperties: readonly string[];

  /** env が持つプロパティ名 */
  envProperties: readonly string[];
}

type BinaryExpressionNode = {
  type: "BinaryExpression";
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
};

type LiteralNode = {
  type: "Literal";
  value: number | string | boolean | null;
};

type VariableTarget =
  | {
      scope: "self";
      name: string;
    }
  | {
      scope: "env";
      name: string;
    }
  | {
      scope: "local";
      name: string;
    };

export class JavaScriptTranspiler {
  private readonly selfProperties: Set<string>;
  private readonly envProperties: Set<string>;

  private localVariables = new Set<string>();
  private indentationLevel = 0;

  constructor(options: TranspileOptions) {
    this.selfProperties = new Set(options.selfProperties);
    this.envProperties = new Set(options.envProperties);
  }

  /**
   * ASTをJavaScriptのコードに変換する
   */
  transpile(program: ProgramNode): string {
    const initCode = this.transpileFunction(program.init);
    const updateCode = this.transpileFunction(program.update);

    return [
      "return {",
      "  init: function(self, env) {",
      initCode,
      "  },",
      "  update: function(self, env) {",
      updateCode,
      "  }",
      "};",
    ].join("\n");
  }

  /**
   * init / update の関数本体を生成する
   */
  private transpileFunction(
    statements: StatementNode[],
  ): string {
    this.localVariables = this.collectLocalVariables(statements);
    this.indentationLevel = 2;

    const lines: string[] = [];

    // ローカル変数は関数の先頭で宣言する。
    // if文の中で代入される変数も、外側から参照できる。
    for (const name of this.localVariables) {
      lines.push(`${this.indent()}let ${name};`);
    }

    for (const statement of statements) {
      lines.push(this.transpileStatement(statement));
    }

    return lines
      .filter((line) => line.length > 0)
      .join("\n");
  }

  /**
   * 代入先がローカル変数かどうかを調べる
   */
  private resolveVariable(name: string): VariableTarget {
    if (this.selfProperties.has(name)) {
      return {
        scope: "self",
        name,
      };
    }

    if (this.envProperties.has(name)) {
      return {
        scope: "env",
        name,
      };
    }

    return {
      scope: "local",
      name,
    };
  }

  /**
   * 変数名をJavaScriptの識別子またはプロパティに変換する
   */
  private transpileIdentifier(
    node: IdentifierNode,
  ): string {
    const target = this.resolveVariable(node.name);

    switch (target.scope) {
      case "self":
        return `self.${target.name}`;

      case "env":
        return `env.${target.name}`;

      case "local":
        return target.name;
    }
  }

  /**
   * 文をJavaScriptに変換する
   */
  private transpileStatement(
    statement: StatementNode,
  ): string {
    switch (statement.type) {
      case "Assignment":
        return this.transpileAssignment(statement);

      case "IfStatement":
        return this.transpileIfStatement(statement);

      default:
        return this.assertNever(statement);
    }
  }

  /**
   * 代入文を変換する
   *
   * x += 1 がAST上で x = x + 1 として表現されている場合も、
   * x += 1 として出力する。
   */
  private transpileAssignment(
    node: AssignmentNode,
  ): string {
    const left = node.left;
    const right = node.right;

    const target = this.resolveVariable(left.name);
    const leftCode = this.transpileIdentifier(left);

    if (right.type === "BinaryExpression") {
      const binary = right as BinaryExpressionNode;

      if (
        binary.left.type === "Identifier" &&
        binary.left.name === left.name &&
        ["+", "-", "*", "/"].includes(binary.operator)
      ) {
        const operator = binary.operator;

        return (
          `${this.indent()}${leftCode} ${operator}= ` +
          `${this.transpileExpression(binary.right)};`
        );
      }
    }

    // ローカル変数は関数冒頭で宣言済みなので、
    // ここでは代入だけを行う。
    void target;

    return (
      `${this.indent()}${leftCode} = ` +
      `${this.transpileExpression(right)};`
    );
  }

  /**
   * if文を変換する
   */
  private transpileIfStatement(
    node: IfStatementNode,
  ): string {
    const lines: string[] = [];

    lines.push(
      `${this.indent()}if (${this.transpileExpression(node.condition)}) {`,
    );

    this.indentationLevel++;

    for (const statement of node.body) {
      lines.push(this.transpileStatement(statement));
    }

    this.indentationLevel--;

    lines.push(`${this.indent()}}`);

    return lines.join("\n");
  }

  /**
   * 式をJavaScriptに変換する
   */
  private transpileExpression(
    node: ExpressionNode,
  ): string {
    switch (node.type) {
      case "Literal":
        return this.transpileLiteral(node as LiteralNode);

      case "Identifier":
        return this.transpileIdentifier(node);

      case "BinaryExpression": {
        const binary = node as BinaryExpressionNode;

        return (
          `(${this.transpileExpression(binary.left)} ` +
          `${binary.operator} ` +
          `${this.transpileExpression(binary.right)})`
        );
      }

      case "FunctionCall":
        return this.transpileFunctionCall(node);

      default:
        return this.assertNever(node);
    }
  }

  /**
   * リテラルを変換する
   */
  private transpileLiteral(
    node: LiteralNode,
  ): string {
    return JSON.stringify(node.value) ?? "null";
  }

  /**
   * 関数呼び出しを変換する
   */
  private transpileFunctionCall(
    node: FunctionCallNode,
  ): string {
    const args = node.arguments
      .map((argument) => this.transpileExpression(argument))
      .join(", ");

    return `${node.name}(${args})`;
  }

  /**
   * ローカル変数を収集する
   *
   * if文の中にある代入も再帰的に調べる。
   */
  private collectLocalVariables(
    statements: StatementNode[],
  ): Set<string> {
    const variables = new Set<string>();

    const visit = (statement: StatementNode): void => {
      switch (statement.type) {
        case "Assignment": {
          const target = this.resolveVariable(statement.left.name);

          if (target.scope === "local") {
            variables.add(statement.left.name);
          }

          break;
        }

        case "IfStatement":
          for (const child of statement.body) {
            visit(child);
          }

          break;

        default:
          this.assertNever(statement);
      }
    };

    for (const statement of statements) {
      visit(statement);
    }

    return variables;
  }

  private indent(): string {
    return "  ".repeat(this.indentationLevel);
  }

  private assertNever(value: never): never {
    throw new Error(
      `未対応のASTノードです: ${JSON.stringify(value)}`,
    );
  }
}

/**
 * トランスパイル用の便利関数
 */
export function transpileToJavaScript(
  program: ProgramNode,
  options: TranspileOptions,
): string {
  const transpiler = new JavaScriptTranspiler(options);

  return transpiler.transpile(program);
}