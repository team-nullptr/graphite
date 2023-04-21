import { Token, TokenType } from "./tokens";
import { EdgeStmt, Stmt, VertexStmt } from "./stmt";
import { LiteralExpr } from "./expr";

/*
statement -> vertexStmt | edgeStmt
vertexStmt -> "vertex" primary primary
edgeStmt -> "edge" primary primary
primary -> NUMBER | STRING
*/

export class Parser {
  private tokens: Token[] = [];
  private current = 0;

  load(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): Stmt[] {
    const statements: Stmt[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }

    return statements;
  }

  private statement(): Stmt {
    if (this.match("VERTEX")) {
      return this.vertexStmt();
    } else if (this.match("EDGE")) {
      return this.edgeStmt();
    }

    throw new Error("Expected 'vertex' or 'edge' statement");
  }

  private vertexStmt(): Stmt {
    const id = this.expression();
    const value = this.expression();
    return new VertexStmt(id, value);
  }

  private edgeStmt(): Stmt {
    const a = this.expression();
    const b = this.expression();
    return new EdgeStmt(a, b);
  }

  private expression(): LiteralExpr {
    // TODO: Handle errors
    if (!this.match("NUMBER", "STRING")) {
      throw new Error(`Expected expression at ${this.peek()}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const previous = this.previous()!;
    return new LiteralExpr(previous.literal);
  }

  private previous(): Token | undefined {
    return this.tokens.at(this.current - 1);
  }

  /** Tries to match the next token with any of the given types. */
  private match(...types: TokenType[]): boolean {
    return !!(types.some((type) => this.check(type)) && this.advance());
  }

  /** Advances to the next token. */
  private advance() {
    return this.tokens[this.current++];
  }

  /** Checks if next token is of a given type. */
  private check(type: TokenType): boolean {
    return this.isAtEnd() ? false : this.peek().type === type;
  }

  /** Returns the next token. */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /** Checks if there are any unprocessed tokens left. */
  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
}
