import { CstChildrenDictionary, CstNode, IToken } from "chevrotain";

export interface ProgramNode {
  type: "Program";
  init: StatementNode[];
  update: StatementNode[];
}

export type StatementNode =
  | IfStatementNode
  | AssignmentNode;

export interface IfStatementNode {
  type: "IfStatement";
  condition: ExpressionNode;
  body: StatementNode[];
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
  | FunctionCallNode;

export interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export interface LiteralNode {
  type: "Literal";
  value: number;
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
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