import { Token } from "./token";
import { TokenType } from "./types/token";
import { Expr, Literal, Call, Variable } from "./expr";
import { Expression, Stmt } from "./stmt";

/*

program   ::= statement* EOF
statement ::= exprStmt
exprStmt  ::= call
call      ::= primary "(" arguments? ")" 
arguments ::= primary ( "," primary )*
primary   ::= NUMBER | IDENTIFIER

*/

export class Parser {
  private current = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): Stmt[] {
    const stmts: Stmt[] = [];

    while (!this.isAtEnd()) {
      stmts.push(this.stmt());
    }

    return stmts;
  }

  private stmt(): Stmt {
    return new Expression(this.call());
  }

  private call(): Expr {
    let expr: Expr = this.primary();

    if (this.match("LEFT_PAREN")) {
      expr = this.finishCall(expr);
    }

    return expr;
  }

  private finishCall(calle: Expr): Expr {
    const args: Expr[] = [];

    if (!this.check("RIGHT_PAREN")) {
      do {
        if (args.length > 255) {
          throw new Error("Can't have more than 255 arguments.");
        }

        args.push(this.primary());
      } while (this.match("COMMA"));
    }

    const paren: Token = this.consume(
      "RIGHT_PAREN",
      "Expected ')' after function arguments"
    );

    return new Call(calle, paren, args);
  }

  private primary(): Expr {
    if (this.match("NUMBER")) {
      return new Literal(this.previous().literal);
    }

    if (this.match("IDENTIFIER")) {
      return new Variable(this.previous());
    }

    throw new Error("Expected expression");
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

    throw new Error(error);
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
