import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";

export interface ProgramNode {
  type: "Program";
  init: StatementNode[];
  update: StatementNode[];
}

export type StatementNode =
  | IfStatementNode
  | AssignmentNode
  | FunctionCallStatementNode;

export interface IfStatementNode {
  type: "IfStatement";
  condition: ExpressionNode;
  body: StatementNode[];
  elseBody?: StatementNode[];
}

export interface AssignmentNode {
  type: "Assignment";
  left: IdentifierNode;
  right: ExpressionNode;
}

export type ExpressionNode =
  | IdentifierNode
  | LiteralNode
  | BinaryExpressionNode
  | FunctionCallNode
  | UnaryExpressionNode;

export interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export interface LiteralNode {
  type: "Literal";
  value: number | string;
}

export interface UnaryExpressionNode {
  type: "UnaryExpression";
  operator: "!" | "-";
  argument: ExpressionNode;
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface FunctionCallStatementNode {
  type: "FunctionCallStatement";
  expression: FunctionCallNode;
}

export interface FunctionCallNode {
  type: "FunctionCall";
  name: string;
  arguments: ExpressionNode[];
}

export type CstChild = CstNode | IToken;

export type CstContext = CstChildrenDictionary & {
  [key: string]: CstChild[] | undefined;
};