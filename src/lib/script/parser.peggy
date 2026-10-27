Program
  = _ init:InitBlock? _ update:UpdateBlock? _ {
      return { type: "Program", init: init || [], update: update || [] };
    }

InitBlock
  = "init" _ "{" _ statements:Statement* _ "}" {
      return statements;
    }

UpdateBlock
  = "update" _ "{" _ statements:Statement* _ "}" {
      return statements;
    }

Statement
  = IfStatement
  | AssignmentStatement

IfStatement
  = "if" _ "(" _ cond:Expression _ ")" _ "{" _ body:Statement* _ "}" {
      return { type: "IfStatement", condition: cond, body: body };
    }

AssignmentStatement
  = name:Identifier _ "=" _ expr:Expression _ ";" {
      return { type: "Assignment", left: name, right: expr };
    }
  | name:Identifier _ "+=" _ expr:Expression _ ";" {
      return { 
        type: "Assignment", 
        left: name, 
        right: { type: "BinaryExpression", operator: "+", left: name, right: expr } 
      };
    }

Expression
  = Additive

Additive
  = left:Multiplicative _ op:[+\-] _ right:Additive {
      return { type: "BinaryExpression", operator: op, left, right };
    }
  | Multiplicative

Multiplicative
  = left:Primary _ op:[*/] _ right:Multiplicative {
      return { type: "BinaryExpression", operator: op, left, right };
    }
  | Primary

Primary
  = FunctionCall
  | Number
  | Identifier
  | "(" _ expr:Expression _ ")" { return expr; }

FunctionCall
  = name:Identifier _ "(" _ args:ExpressionList? _ ")" {
      return { type: "FunctionCall", name: name, arguments: args || [] };
    }

ExpressionList
  = head:Expression tail:(_ "," _ tail:Expression)* {
      return [head, ...tail.map(t => t[3])];
    }

Number
  = val:$([0-9]+ ("." [0-9]+)?) {
      return { type: "Literal", value: parseFloat(val) };
    }

Identifier
  = id:$([a-zA-Z_][a-zA-Z0-9_]*) {
      return { type: "Identifier", name: id };
    }

_
  = ([ \t\n\r] / Comment)*

Comment
  = "//" (![\n\r] .)*