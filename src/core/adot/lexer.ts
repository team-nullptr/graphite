import { Token, TokenType, lookupIdentifier } from "./token";

export class Lexer {
  private char = "\0";
  private pos = 0;
  private readPos = 0;

  constructor(private readonly source: string) {
    this.readChar();
  }

  nextToken() {
    let token: Token;

    this.skipWhitespace();

    switch (this.char) {
      case "-":
        if (this.peekChar() === "-") {
          const literal = this.char + this.peekChar();
          this.readChar();
          token = this.newToken("EDGE", literal);
        } else if (this.peekChar() === ">") {
          const literal = this.char + this.peekChar();
          this.readChar();
          token = this.newToken("DIRECTED_EDGE", literal);
        } else {
          token = this.newToken("ILLEGAL", this.char + this.peekChar());
        }
        break;
      case "=":
        token = this.newToken("EQ", this.char);
        break;
      case "{":
        token = this.newToken("LBRACE", this.char);
        break;
      case "}":
        token = this.newToken("RBRACE", this.char);
        break;
      case "[":
        token = this.newToken("LBRACKET", this.char);
        break;
      case "]":
        token = this.newToken("RBRACKET", this.char);
        break;
      case ";":
        token = this.newToken("SEMICOLON", this.char);
        break;
      case "\0":
        token = this.newToken("EOF", "");
        break;
      default:
        if (this.isLetter(this.char)) {
          const literal = this.readIdentifier();
          return new Token(lookupIdentifier(literal), literal);
        }

        if (this.isNumber(this.char)) {
          return new Token("NUMBER", this.readNumber());
        }

        token = this.newToken("ILLEGAL", this.char);
    }

    this.readChar();
    return token;
  }

  private readNumber(): string {
    const position = this.pos;

    while (this.isNumber(this.char)) {
      this.readChar();
    }

    if (this.char === ".") {
      this.readChar();

      while (this.isNumber(this.char)) {
        this.readChar();
      }
    }

    return this.source.slice(position, this.pos);
  }

  private readIdentifier(): string {
    const position = this.pos;

    while (this.isLetter(this.char)) {
      this.readChar();
    }

    return this.source.slice(position, this.pos);
  }

  private skipWhitespace() {
    while ([" ", "\t", "\n"].includes(this.char)) {
      this.readChar();
    }
  }

  private isNumber(char: string): boolean {
    return "0" <= char && char <= "9";
  }

  private isLetter(char: string): boolean {
    return ("a" <= char && char <= "z") || ("A" <= char && char <= "Z");
  }

  private peekChar() {
    if (this.readPos < this.source.length) {
      return this.source[this.readPos];
    }

    return "\0";
  }

  private readChar() {
    if (this.readPos >= this.source.length) {
      this.char = "\0";
    } else {
      this.char = this.source[this.readPos];
    }

    this.pos = this.readPos;
    this.readPos += 1;
  }

  private newToken(tokenType: TokenType, char: string): Token {
    return new Token(tokenType, char);
  }
}
