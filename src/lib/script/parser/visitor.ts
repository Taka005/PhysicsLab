import { CstNode, IToken } from "chevrotain";
import { AssignmentNode, ExpressionNode, FunctionCallNode, IdentifierNode, IfStatementNode, ProgramNode, StatementNode, CstContext } from "./types";
import { parser } from "./parser";

const BaseCstVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

class AstVisitor extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  private getNodes(
    ctx: CstContext,
    key: string,
  ): CstNode[] {
    return (ctx[key] ?? []).filter(
      (child): child is CstNode => "children" in child,
    );
  }

  private getTokens(
    ctx: CstContext,
    key: string,
  ): IToken[] {
    return (ctx[key] ?? []).filter(
      (child): child is IToken => "image" in child,
    );
  }

  private visitNode<T>(node: CstNode): T {
    return this.visit(node) as T;
  }

  public program(ctx: CstContext): ProgramNode {
    const initBlock = this.getNodes(ctx, "initBlock");
    const updateBlock = this.getNodes(ctx, "updateBlock");

    return {
      type: "Program",
      init: initBlock.length > 0
        ? this.visitNode<StatementNode[]>(initBlock[0])
        : [],
      update: updateBlock.length > 0
        ? this.visitNode<StatementNode[]>(updateBlock[0])
        : [],
    };
  }

  public initBlock(ctx: CstContext): StatementNode[] {
    return this.getNodes(ctx, "statement").map(
      (node) => this.visitNode<StatementNode>(node),
    );
  }

  public updateBlock(ctx: CstContext): StatementNode[] {
    return this.getNodes(ctx, "statement").map(
      (node) => this.visitNode<StatementNode>(node),
    );
  }

  public statement(ctx: CstContext): StatementNode {
    const ifStatement = this.getNodes(ctx, "ifStatement");

    if (ifStatement.length > 0) {
      return this.visitNode<IfStatementNode>(ifStatement[0]);
    }

    const assignmentStatement = this.getNodes(
      ctx,
      "assignmentStatement",
    );

    if (assignmentStatement.length === 0) {
      throw new Error("statementに対応するノードがありません");
    }

    return this.visitNode<AssignmentNode>(assignmentStatement[0]);
  }

  public ifStatement(ctx: CstContext): IfStatementNode {
    const expressions = this.getNodes(ctx, "expression");
    const conditionNode = expressions[0];

    if (!conditionNode) {
      throw new Error("ifStatementにconditionがありません");
    }

    return {
      type: "IfStatement",
      condition: this.visitNode<ExpressionNode>(conditionNode),
      body: this.getNodes(ctx, "statement").map(
        (node) => this.visitNode<StatementNode>(node),
      ),
    };
  }

  public assignmentStatement(ctx: CstContext): AssignmentNode {
    const nameNode = this.getNodes(ctx, "name")[0];

    if (!nameNode) {
      throw new Error("assignmentStatementにnameがありません");
    }

    const expressionNode = this.getNodes(ctx, "expression")[0];

    if (!expressionNode) {
      throw new Error("assignmentStatementにexpressionがありません");
    }

    const name = this.visitNode<string>(nameNode);

    const left: IdentifierNode = {
      type: "Identifier",
      name,
    };

    const right = this.visitNode<ExpressionNode>(expressionNode);

    const compoundOperators: Readonly<Record<string, string>> = {
      PlusAssign: "+",
      MinusAssign: "-",
      MultiplyAssign: "*",
      DivideAssign: "/",
    };

    const compoundOperator = Object.entries(compoundOperators).find(
      ([tokenName]) => this.getTokens(ctx, tokenName).length > 0,
    )?.[1];

    if (compoundOperator) {
      return {
        type: "Assignment",
        left,
        right: {
          type: "BinaryExpression",
          operator: compoundOperator,
          left,
          right,
        },
      };
    }

    return {
      type: "Assignment",
      left,
      right,
    };
  }

  public expression(ctx: CstContext): ExpressionNode {
    const comparison = this.getNodes(ctx, "comparison")[0];

    if (!comparison) {
      throw new Error("expressionにcomparisonがありません");
    }

    return this.visitNode<ExpressionNode>(comparison);
  }

  public comparison(ctx: CstContext): ExpressionNode {
    const leftNode = this.getNodes(ctx, "left")[0];

    if (!leftNode) {
      throw new Error("comparisonにleftがありません");
    }

    const left = this.visitNode<ExpressionNode>(leftNode);
    const operator = this.getTokens(ctx, "operator")[0];

    if (!operator) {
      return left;
    }

    const rightNode = this.getNodes(ctx, "right")[0];

    if (!rightNode) {
      throw new Error("comparisonにrightがありません");
    }

    return {
      type: "BinaryExpression",
      operator: operator.image,
      left,
      right: this.visitNode<ExpressionNode>(rightNode),
    };
  }

  public additive(ctx: CstContext): ExpressionNode {
    return this.visitBinaryExpression(ctx);
  }

  public multiplicative(ctx: CstContext): ExpressionNode {
    return this.visitBinaryExpression(ctx);
  }

  private visitBinaryExpression(
    ctx: CstContext,
  ): ExpressionNode {
    const operands = this.getNodes(ctx, "operands");
    const operators = this.getTokens(ctx, "operators");

    const firstOperand = operands[0];

    if (!firstOperand) {
      throw new Error("演算式にoperandがありません");
    }

    let result = this.visitNode<ExpressionNode>(firstOperand);

    for (let i = 0; i < operators.length; i++) {
      const nextOperand = operands[i + 1];

      if (!nextOperand) {
        throw new Error("演算子に対応するoperandがありません");
      }

      result = {
        type: "BinaryExpression",
        operator: operators[i].image,
        left: result,
        right: this.visitNode<ExpressionNode>(nextOperand),
      };
    }

    return result;
  }

  public primary(ctx: CstContext): ExpressionNode {
    const functionCall = this.getNodes(ctx, "functionCall")[0];

    if (functionCall) {
      return this.visitNode<FunctionCallNode>(functionCall);
    }

    const numberLiteral = this.getTokens(ctx, "NumberLiteral")[0];

    if (numberLiteral) {
      return {
        type: "Literal",
        value: Number.parseFloat(numberLiteral.image),
      };
    }

    const variableName = this.getNodes(ctx, "variableName")[0];

    if (variableName) {
      return {
        type: "Identifier",
        name: this.visitNode<string>(variableName),
      };
    }

    const expression = this.getNodes(ctx, "expression")[0];

    if (expression) {
      return this.visitNode<ExpressionNode>(expression);
    }

    throw new Error("primaryに対応するノードがありません");
  }

  public functionCall(ctx: CstContext): FunctionCallNode {
    const name = this.getTokens(ctx, "name")[0];

    if (!name) {
      throw new Error("functionCallにnameがありません");
    }

    const expressionList = this.getNodes(ctx, "expressionList")[0];

    return {
      type: "FunctionCall",
      name: name.image,
      arguments: expressionList
        ? this.visitNode<ExpressionNode[]>(expressionList)
        : [],
    };
  }

  public expressionList(ctx: CstContext): ExpressionNode[] {
    const head = this.getNodes(ctx, "head")[0];

    if (!head) {
      throw new Error("expressionListにheadがありません");
    }

    return [
      this.visitNode<ExpressionNode>(head),
      ...this.getNodes(ctx, "tail").map(
        (node) => this.visitNode<ExpressionNode>(node),
      ),
    ];
  }

  public variableName(ctx: CstContext): string {
    return this.getTokens(ctx, "parts")
      .map((token) => token.image)
      .join(".");
  }
}

export const visitor = new AstVisitor();