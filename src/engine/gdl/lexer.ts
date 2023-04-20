/*

vertex A 10
vertex B 10
edge A B 20 

vertex ::= "vertex" 
edge ::= vertex vertex

*/

import { Token } from "./tokens";

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
      this.scanToken();
    }

    this.tokens.push({ kind: "EOF" });
    return this.tokens;
  }

  private scanToken() {
    while (!this.isAtEnd()) {
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
  }

  /** Scans a number. */
  private number() {
    // TODO: Do we want to support floating point numbers?
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    const text = this.source.slice(this.start, this.current);
    this.tokens.push({ kind: "NUMBER", literal: parseInt(text) });
  }

  /** Scans an identifier. */
  private identifier() {
    while (this.isAlpha(this.peek())) this.advance();

    const text = this.source.slice(this.start, this.current);

    switch (text) {
      case "edge":
        this.tokens.push({ kind: "EDGE" });
        break;
      case "vertex":
        this.tokens.push({ kind: "VERTEX" });
        break;
      default:
        this.tokens.push({ kind: "STRING", literal: text });
        break;
    }
  }

  /** Checks if given character is a valid number. */
  private isDigit(char: string) {
    return !Number.isNaN(char);
  }

  /** Checks if char is alphanumeric. */
  private isAlpha(char: string) {
    return /[a-zA-Z_]*/g.test(char);
  }

  /** Checks if we finished parsing. */
  private isAtEnd() {
    return this.current < this.source.length;
  }

  /** Advances to the next character. */
  private advance() {
    return this.source[this.current++];
  }

  /** Looks at the next character. */
  private peek() {
    return this.source[this.current];
  }
}
