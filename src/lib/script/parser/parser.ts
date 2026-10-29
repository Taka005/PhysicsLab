import {
  CstParser,
  EOF
} from "chevrotain";
import { allTokens, Assign, Comma, Divide, DivideAssign, Dot, EqualEqual, Greater, GreaterEqual, Identifier, If, Init, LBrace, Less, LessEqual, LParen, Minus, MinusAssign, Multiply, MultiplyAssign, NotEqual, NumberLiteral, Plus, PlusAssign, RBrace, RParen, Semicolon, Update } from "./tokens";

class ScriptParser extends CstParser {
  public program = this.RULE("program", () => {
    this.OPTION(() => {
      this.SUBRULE(this.initBlock);
    });

    this.OPTION2(() => {
      this.SUBRULE(this.updateBlock);
    });

    this.CONSUME(EOF);
  });

  public initBlock = this.RULE("initBlock", () => {
    this.CONSUME(Init);
    this.CONSUME(LBrace);

    this.MANY(() => {
      this.SUBRULE(this.statement);
    });

    this.CONSUME(RBrace);
  });

  public updateBlock = this.RULE("updateBlock", () => {
    this.CONSUME(Update);
    this.CONSUME(LBrace);

    this.MANY(() => {
      this.SUBRULE(this.statement);
    });

    this.CONSUME(RBrace);
  });

  public statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.functionCallStatement) },
      { ALT: () => this.SUBRULE(this.assignmentStatement) },
    ]);
  });

  public ifStatement = this.RULE("ifStatement", () => {
    this.CONSUME(If);
    this.CONSUME(LParen);
    this.SUBRULE(this.expression);
    this.CONSUME(RParen);
    this.CONSUME(LBrace);

    this.MANY(() => {
      this.SUBRULE(this.statement);
    });

    this.CONSUME(RBrace);
  });

  public assignmentStatement = this.RULE("assignmentStatement",() => {
     this.SUBRULE(this.variableName, { LABEL: "name" });

    this.OR([
      { ALT: () => this.CONSUME(PlusAssign) },
      { ALT: () => this.CONSUME(MinusAssign) },
      { ALT: () => this.CONSUME(MultiplyAssign) },
      { ALT: () => this.CONSUME(DivideAssign) },
      { ALT: () => this.CONSUME(Assign) },
    ]);

    this.SUBRULE(this.expression);
    this.OPTION(() => this.CONSUME(Semicolon));
  });

  public expression = this.RULE("expression", () => {
    this.SUBRULE(this.comparison);
  });

  public comparison = this.RULE("comparison", () => {
    this.SUBRULE(this.additive, { LABEL: "left" });

    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(GreaterEqual, { LABEL: "operator" }) },
        { ALT: () => this.CONSUME(LessEqual, { LABEL: "operator" }) },
        { ALT: () => this.CONSUME(EqualEqual, { LABEL: "operator" }) },
        { ALT: () => this.CONSUME(NotEqual, { LABEL: "operator" }) },
        { ALT: () => this.CONSUME(Greater, { LABEL: "operator" }) },
        { ALT: () => this.CONSUME(Less, { LABEL: "operator" }) },
      ]);

      this.SUBRULE2(this.additive, { LABEL: "right" });
    });
  });

  public additive = this.RULE("additive", () => {
    this.SUBRULE(this.multiplicative, {
       LABEL: "operands",
    });

    this.MANY(() => {
      this.OR([
      {
        ALT: () => this.CONSUME(Plus, {
          LABEL: "operators",
        }),
      },
      {
        ALT: () => this.CONSUME(Minus, {
          LABEL: "operators",
        }),
      },
      ]);

      this.SUBRULE2(this.multiplicative, {
        LABEL: "operands",
      });
    });
  });

  public multiplicative = this.RULE("multiplicative", () => {
    this.SUBRULE(this.primary, {
      LABEL: "operands",
    });

    this.MANY(() => {
      this.OR([
        {
          ALT: () => this.CONSUME(Multiply, {
            LABEL: "operators",
          }),
        },
        {
          ALT: () => this.CONSUME(Divide, {
            LABEL: "operators",
          }),
        },
      ]);

      this.SUBRULE2(this.primary, {
        LABEL: "operands",
      });
    });
  });

  public primary = this.RULE("primary", () => {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.functionCall),
      },
      {
        ALT: () => this.CONSUME(NumberLiteral),
      },
      {
        ALT: () => this.SUBRULE(this.variableName),
      },
      {
        ALT: () => {
          this.CONSUME(LParen);
          this.SUBRULE(this.expression);
          this.CONSUME(RParen);
        },
      },
    ]);
  });

  public functionCall = this.RULE("functionCall", () => {
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(LParen);

    this.OPTION(() => {
      this.SUBRULE(this.expressionList);
    });

    this.CONSUME(RParen);
  });

  public functionCallStatement = this.RULE("functionCallStatement",() => {
    this.SUBRULE(this.functionCall);
    this.OPTION(() => {
      this.CONSUME(Semicolon);
    });
  });

  public expressionList = this.RULE("expressionList", () => {
    this.SUBRULE(this.expression, { LABEL: "head" });

    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.expression, { LABEL: "tail" });
    });
  });

  public variableName = this.RULE("variableName", () => {
    this.CONSUME(Identifier, { LABEL: "parts" });

    this.MANY(() => {
      this.CONSUME(Dot);
      this.CONSUME2(Identifier, { LABEL: "parts" });
    });
  });

  public constructor() {
    super(allTokens, {
      recoveryEnabled: false,
    });

    this.performSelfAnalysis();
  }
}

export const parser = new ScriptParser();