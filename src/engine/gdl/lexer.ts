import { Token, TokenType } from "./tokens";

export class Lexer {
  private source = "";
  private start = 0;
  private line = 0;
  private current = 0;
  private tokens: Token[] = [];

  /** Loads new source code so that it can be parsed. */
  load(source: string) {
    this.source = source;
    this.start = 0;
    this.line = 0;
    this.current = 0;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      console.log(this.start);
      this.scanToken();
    }

    return this.tokens;
  }

  private scanToken() {
    const char = this.advance();

    switch (char) {
      // Skip white characters
      case " ":
        break;

      case "\n":
        this.line++;
        break;

      // Scan longer lexemes
      default:
        if (this.isAlpha(char)) {
          this.identifier();
        } else if (this.isDigit(char)) {
          this.number();
        } else {
          throw new Error(`Unexpected character at line ${this.line}.`);
        }
    }
  }

  /** Scans a number. */
  private number() {
    // TODO: Do we want to support floating point numbers?
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    const text = this.source.slice(this.start, this.current);
    this.addToken("NUMBER", parseInt(text));
  }

  /** Scans an identifier. */
  private identifier() {
    while (this.isAlpha(this.peek())) this.advance();

    const text = this.source.slice(this.start, this.current);

    switch (text) {
      case "edge":
        this.addToken("EDGE");
        break;
      case "vertex":
        this.addToken("VERTEX");
        break;
      default:
        this.addToken("STRING", text);
        break;
    }
  }

  /** Utility function for adding tokens. */
  private addToken(type: TokenType, literal: unknown = undefined) {
    const lexeme = this.source.slice(this.start, this.current);
    this.tokens.push(new Token(type, lexeme, literal, this.line));
  }

  /** Checks if given character is a valid number. */
  private isDigit(char: string): boolean {
    return /[0-9]+/g.test(char);
  }

  /** Checks if char is alphanumeric. */
  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]+/g.test(char);
  }

  /** Checks if we finished parsing. */
  private isAtEnd() {
    return this.current >= this.source.length;
  }

  /** Advances to the next character. */
  private advance() {
    return this.source[this.current++];
  }

  /** Looks at the next character. */
  private peek() {
    return this.isAtEnd() ? "\0" : this.source[this.current];
  }
}
