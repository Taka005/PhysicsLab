import {
  ProgramNode,
  StatementNode,
  AssignmentNode,
  IfStatementNode,
  ExpressionNode,
  FunctionCallNode,
} from "./types";

export class Transpiler {
  private globalVariables = new Set<string>();

  private localVariables = new Set<string>();

  private static readonly CUSTOM_VALUES: Record<string, string> = {
    "PI": "Math.PI",
    "E": "Math.E"
  };

  private static readonly CUSTOM_FUNCTIONS: Record<string, string> = {
    "sin": "Math.sin",
    "cos": "Math.cos",
    "abs": "Math.abs",
    "max": "Math.max",
    "min": "Math.min",
    "console": "console.log"
  };

  public transpile(program: ProgramNode): string {
    this.globalVariables.clear();
    this.localVariables.clear();

    this.collectGlobalVariables(program.init);

    this.collectLocalVariables(program.update);

    const initCode = program.init
      .map((statement) => this.transpileStatement(statement, "init"))
      .join("\n");

    const localDeclarations = [...this.localVariables]
      .map((name) => `let ${name};`)
      .join("\n");

    const updateStatements = program.update
      .map((statement) => this.transpileStatement(statement, "update"))
      .join("\n");

    const updateCode = [
      localDeclarations,
      updateStatements,
    ]
    .filter((code) => code.length > 0)
    .join("\n");

    return `return {
      init: function(obj, global) {
      ${this.indent(initCode, 4)}
      },
      update: function(obj, global) {
      ${this.indent(updateCode, 4)}
      }
      };`;
  }

  private collectGlobalVariables(statements: StatementNode[]): void {
    for (const statement of statements) {
      switch (statement.type) {
        case "Assignment": {
          const name = statement.left.name;

          if (!this.isObjectVariable(name)) {
            this.globalVariables.add(name);
          }

          break;
        }

        case "IfStatement":
          this.collectGlobalVariables(statement.body);
          break;
      }
    }
  }

  private collectLocalVariables(statements: StatementNode[]): void {
    for (const statement of statements) {
      switch (statement.type) {
        case "Assignment": {
          const name = statement.left.name;

          if (
            !this.isObjectVariable(name) &&
            !this.globalVariables.has(name)
          ) {
            this.localVariables.add(name);
          }

          break;
        }

        case "IfStatement":
          this.collectLocalVariables(statement.body);
          break;
      }
    }
  }

  private transpileStatement(
    statement: StatementNode,
    scope: "init" | "update",
  ): string {
    switch (statement.type) {
      case "Assignment":
        return this.transpileAssignment(statement, scope);

      case "IfStatement":
        return this.transpileIfStatement(statement, scope);

      case "FunctionCallStatement":
        return `${this.transpileExpression(
          statement.expression,
          scope,
        )};`;

      default:
        throw new Error(
          `未対応のステートメントです: ${statement}`,
        );
    }
  }

  private transpileAssignment(
    node: AssignmentNode,
    scope: "init" | "update",
  ): string {
    const name = node.left.name;
    const left = this.resolveIdentifier(name, scope);
    const right = this.transpileExpression(node.right, scope);

    if (scope === "init" && !this.isObjectVariable(name)) {
      return `global.${name} = ${right};`;
    }

    return `${left} = ${right};`;
  }

  private transpileIfStatement(
    node: IfStatementNode,
    scope: "init" | "update",
  ): string {
    const condition = this.transpileExpression(node.condition, scope);

    const body = node.body
      .map((statement) => this.transpileStatement(statement, scope))
      .join("\n");

    return `if (${condition}) {\n${this.indent(body, 2)}\n}`;
  }

  private transpileExpression(
    node: ExpressionNode,
    scope: "init" | "update",
  ): string {
    switch (node.type) {
      case "Identifier":
        return this.resolveIdentifier(node.name, scope);

      case "Literal":
        return typeof node.value === "string"
          ? JSON.stringify(node.value)
          : String(node.value);

      case "BinaryExpression":
        return `(${this.transpileExpression(node.left, scope)} ${node.operator} ${this.transpileExpression(node.right, scope)})`;

      case "UnaryExpression":
        return `(!${this.transpileExpression(node.argument, scope)})`;

      case "FunctionCall":
        return this.transpileFunctionCall(node, scope);

      default:
        throw new Error(
          `未対応の式です: ${(node as { type: string }).type}`,
        );
    }
  }

  private transpileFunctionCall(
    node: FunctionCallNode,
    scope: "init" | "update",
  ): string {
    const args = node.arguments
      .map((argument) => this.transpileExpression(argument, scope))
      .join(", ");

    if (Transpiler.CUSTOM_FUNCTIONS[node.name]) {
      return `${Transpiler.CUSTOM_FUNCTIONS[node.name]}(${args})`;
    }

    return `${node.name}(${args})`;
  }

  private resolveIdentifier(
    name: string,
    scope: "init" | "update",
  ): string {
    if (Transpiler.CUSTOM_VALUES[name]) {
      return Transpiler.CUSTOM_VALUES[name];
    }

    if (this.isObjectVariable(name)) {
      return name;
    }

    if (this.globalVariables.has(name)) {
      return `global.${name}`;
    }

    if (scope === "update" && this.localVariables.has(name)) {
      return name;
    }

    return name;
  }

  private isObjectVariable(name: string): boolean {
    return name === "obj" || name.startsWith("obj.");
  }

  private indent(code: string, spaces: number): string {
    if (!code) {
      return "";
    }

    const prefix = " ".repeat(spaces);

    return code
      .split("\n")
      .map((line) => (line.length > 0 ? `${prefix}${line}` : line))
      .join("\n");
  }
}

export const transpiler = new Transpiler();