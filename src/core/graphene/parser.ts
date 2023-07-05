import { Token, TokenType } from "./token";
import { Expr, Variable, Literal, NumberLiteral, VertexLiteral } from "./expr";
import { Call } from "./stmt";
import { Statement } from "./stmt";

export class ParseError extends Error {
  constructor(token: Token, message: string) {
    super(
      `[line ${token.line}] Error at ${
        token.type === "EOF" ? "end" : `'${token.lexeme}'`
      }: ${message}`
    );
  }
}

export class Parser {
  private current = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): Statement[] {
    const stmts: Statement[] = [];

    this.ignoreNewLines();

    while (!this.isAtEnd()) {
      stmts.push(this.callStmt());

      if (this.peek().type !== "EOF") {
        this.consume("LINE", "Expected a newline after a statement.");
        this.ignoreNewLines();
      }
    }

    return stmts;
  }

  private callStmt(): Call {
    const calle: Expr = new Variable(
      this.consume("IDENTIFIER", "Expected an identifier.")
    );

    this.consume("LEFT_PAREN", "Expected a function call.");

    let args: Literal[] = [];

    if (!this.check("RIGHT_PAREN")) {
      args = this.finishArgumentList();
    }

    const paren: Token = this.consume(
      "RIGHT_PAREN",
      "Expected ')' after function arguments."
    );

    return new Call(calle, paren, args);
  }

  private finishArgumentList(): Literal[] {
    const args: Literal[] = [];

    do {
      // TODO: Do we really need this chek?
      if (args.length >= 255) {
        throw new ParseError(
          this.peek(),
          "Cannot have more than 255 arguments."
        );
      }

      this.ignoreNewLines();
      args.push(this.argument());
    } while (this.match("COMMA"));

    this.ignoreNewLines();
    return args;
  }

  private argument(): Literal {
    if (this.match("NUMBER")) {
      return new NumberLiteral(
        this.previous(),
        this.previous().literal as number
      );
    }

    if (this.match("IDENTIFIER")) {
      return new VertexLiteral(this.previous(), this.previous().lexeme);
    }

    throw new ParseError(this.peek(), "Expected next function argument.");
  }

  private ignoreNewLines() {
    while (this.match("LINE"));
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private consume(type: TokenType, error: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    throw new ParseError(this.peek(), error);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }

    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
