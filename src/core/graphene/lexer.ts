import { Token } from "./token";
import { TokenType } from "./types/token";

class LexerError extends Error {
  constructor(
    public readonly line: number,
    public readonly c: string,
    message: string
  ) {
    super(`[line ${line}] Error at '${c}': ${message}`);
  }
}

export class Lexer {
  private tokens: Token[] = [];
  private current = 0;
  private line = 1;
  private start = 0;

  constructor(public readonly source: string) {}

  lex(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(
      new Token(
        "EOF",
        "",
        this.line,
        // TODO: Idk if this offset is correct
        this.source.length,
        this.source.length,
        undefined
      )
    );
    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      // Single-character tokens
      case "(":
        this.addToken("LEFT_PAREN");
        break;
      case ")":
        this.addToken("RIGHT_PAREN");
        break;
      case ",":
        this.addToken("COMMA");
        break;

      // Whitespace
      case " ":
      case "\r":
      case "\t":
        break;

      case "\n":
        this.line++;
        break;

      // Longer
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new LexerError(this.line, c, "Unexpected character.");
        }
        break;
    }
  }

  private number(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    const lexeme = this.source.substring(this.start, this.current);
    this.addToken("NUMBER", parseInt(lexeme));
  }

  private identifier(): void {
    while (this.isAlpha(this.peek())) {
      this.advance();
    }

    this.addToken("IDENTIFIER");
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  }

  private peek(): string {
    if (this.isAtEnd()) {
      return "\0";
    }

    return this.source[this.current];
  }

  private advance(): string {
    return this.source[this.current++];
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private addToken(type: TokenType, literal?: unknown): void {
    const lexeme = this.source.substring(this.start, this.current);

    this.tokens.push(
      new Token(type, lexeme, this.line, this.start, this.current, literal)
    );
  }
}
