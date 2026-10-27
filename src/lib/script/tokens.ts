import { createToken, Lexer } from "chevrotain";

export const Init = createToken({
  name: "Init",
  pattern: /init\b/,
});

export const Update = createToken({
  name: "Update",
  pattern: /update\b/,
});

export const If = createToken({
  name: "If",
  pattern: /if\b/,
});

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /[0-9]+(?:\.[0-9]+)?/,
});

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

export const Comment = createToken({
  name: "Comment",
  pattern: /\/\/[^\r\n]*/,
  group: Lexer.SKIPPED,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

export const PlusAssign = createToken({
  name: "PlusAssign",
  pattern: /\+=/,
});

export const GreaterEqual = createToken({
  name: "GreaterEqual",
  pattern: />=/,
});

export const LessEqual = createToken({
  name: "LessEqual",
  pattern: /<=/,
});

export const EqualEqual = createToken({
  name: "EqualEqual",
  pattern: /==/,
});

export const NotEqual = createToken({
  name: "NotEqual",
  pattern: /!=/,
});

export const Greater = createToken({
  name: "Greater",
  pattern: />/,
});

export const Less = createToken({
  name: "Less",
  pattern: /</,
});

export const Assign = createToken({
  name: "Assign",
  pattern: /=/,
});

export const Plus = createToken({
  name: "Plus",
  pattern: /\+/,
});

export const Minus = createToken({
  name: "Minus",
  pattern: /-/,
});

export const Multiply = createToken({
  name: "Multiply",
  pattern: /\*/,
});

export const Divide = createToken({
  name: "Divide",
  pattern: /\//,
});

export const LParen = createToken({
  name: "LParen",
  pattern: /\(/,
});

export const RParen = createToken({
  name: "RParen",
  pattern: /\)/,
});

export const LBrace = createToken({
  name: "LBrace",
  pattern: /\{/,
});

export const RBrace = createToken({
  name: "RBrace",
  pattern: /\}/,
});

export const Comma = createToken({
  name: "Comma",
  pattern: /,/,
});

export const Semicolon = createToken({
  name: "Semicolon",
  pattern: /;/,
});

export const allTokens = [
  WhiteSpace,
  Comment,

  Init,
  Update,
  If,

  NumberLiteral,
  Identifier,

  PlusAssign,
  GreaterEqual,
  LessEqual,
  EqualEqual,
  NotEqual,

  Greater,
  Less,
  Assign,
  Plus,
  Minus,
  Multiply,
  Divide,

  LParen,
  RParen,
  LBrace,
  RBrace,
  Comma,
  Semicolon,
];

export const ScriptLexer = new Lexer(allTokens);