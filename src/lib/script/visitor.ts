import { IToken } from "chevrotain";
import { AssignmentNode, ExpressionNode, FunctionCallNode, IdentifierNode, IfStatementNode, ProgramNode, StatementNode } from "./types";
import { parser } from "./parser";

const BaseCstVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

class AstVisitor extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  program(ctx: any): ProgramNode {
    return {
      type: "Program",
      init: ctx.initBlock
        ? this.visit(ctx.initBlock[0])
        : [],
      update: ctx.updateBlock
        ? this.visit(ctx.updateBlock[0])
        : [],
    };
  }

  initBlock(ctx: any): StatementNode[] {
    return (ctx.statement ?? []).map(
      (statement: any) => this.visit(statement),
    );
  }

  updateBlock(ctx: any): StatementNode[] {
    return (ctx.statement ?? []).map(
      (statement: any) => this.visit(statement),
    );
  }

  statement(ctx: any): StatementNode {
    if (ctx.ifStatement) {
      return this.visit(ctx.ifStatement[0]);
    }

    return this.visit(ctx.assignmentStatement[0]);
  }

  ifStatement(ctx: any): IfStatementNode {
    return {
      type: "IfStatement",
      condition: this.visit(ctx.expression[0]),
      body: (ctx.statement ?? []).map(
        (statement: any) => this.visit(statement),
      ),
    };
  }

  assignmentStatement(ctx: any): AssignmentNode {
    const name = ctx.name[0].image;

    const left: IdentifierNode = {
      type: "Identifier",
      name,
    };

    const expr = this.visit(ctx.expression[0]);

    if (ctx.PlusAssign) {
      return {
        type: "Assignment",
        left,
        right: {
          type: "BinaryExpression",
          operator: "+",
          left,
          right: expr,
        },
      };
    }

    return {
      type: "Assignment",
      left,
      right: expr,
    };
  }

  expression(ctx: any): ExpressionNode {
    return this.visit(ctx.comparison[0]);
  }

  comparison(ctx: any): ExpressionNode {
    const left = this.visit(ctx.left[0]);

    if (!ctx.operator) {
      return left;
    }

    return {
      type: "BinaryExpression",
      operator: ctx.operator[0].image,
      left,
      right: this.visit(ctx.right[0]),
    };
  }

  additive(ctx: any): ExpressionNode {
    const operands = (ctx.operands ?? []) as any[];
    const operators = (ctx.operators ?? []) as IToken[];

    let result = this.visit(operands[0]) as ExpressionNode;

    for (let i = 0; i < operators.length; i++) {
      result = {
        type: "BinaryExpression",
        operator: operators[i].image,
        left: result,
        right: this.visit(operands[i + 1]),
      };
    }

    return result;
  }

  multiplicative(ctx: any): ExpressionNode {
    const operands = (ctx.operands ?? []) as any[];
    const operators = (ctx.operators ?? []) as IToken[];

    let result = this.visit(operands[0]) as ExpressionNode;

    for (let i = 0; i < operators.length; i++) {
      result = {
        type: "BinaryExpression",
        operator: operators[i].image,
        left: result,
        right: this.visit(operands[i + 1]),
      };
    }

    return result;
  }

  primary(ctx: any): ExpressionNode {
    if (ctx.functionCall) {
      return this.visit(ctx.functionCall[0]);
    }

    if (ctx.NumberLiteral) {
      return {
        type: "Literal",
        value: parseFloat(ctx.NumberLiteral[0].image),
      };
    }

    if (ctx.Identifier) {
      return {
        type: "Identifier",
        name: ctx.Identifier[0].image,
      };
    }

    return this.visit(ctx.expression[0]);
  }

  functionCall(ctx: any): FunctionCallNode {
    return {
      type: "FunctionCall",
      name: ctx.name[0].image,
      arguments: ctx.expressionList
        ? this.visit(ctx.expressionList[0])
        : [],
    };
  }

  expressionList(ctx: any): ExpressionNode[] {
    return [
      this.visit(ctx.head[0]),
      ...(ctx.tail ?? []).map(
        (expression: any) => this.visit(expression),
      ),
    ];
  }
}

export const astVisitor = new AstVisitor();