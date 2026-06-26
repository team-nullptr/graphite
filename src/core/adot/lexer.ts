import { Token, TOKEN_TYPE, TokenType, lookupIdentifier } from "./token";

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
    this.skipComment();

    switch (this.char) {
      case "-":
        if (this.peekChar() === "-") {
          const literal = this.char + this.peekChar();
          this.readChar();
          token = this.newToken(TOKEN_TYPE.Edge, literal);
        } else if (this.peekChar() === ">") {
          const literal = this.char + this.peekChar();
          this.readChar();
          token = this.newToken(TOKEN_TYPE.DirectedEdge, literal);
        } else {
          token = this.newToken(TOKEN_TYPE.Illegal, this.char + this.peekChar());
        }
        break;
      case '"':
        const string = this.readString();
        if (string === null) {
          token = this.newToken(TOKEN_TYPE.Illegal, this.char);
        } else {
          token = this.newToken(TOKEN_TYPE.String, string);
        }
        break;
      case "=":
        token = this.newToken(TOKEN_TYPE.Eq, this.char);
        break;
      case "{":
        token = this.newToken(TOKEN_TYPE.LBrace, this.char);
        break;
      case "}":
        token = this.newToken(TOKEN_TYPE.RBrace, this.char);
        break;
      case "[":
        token = this.newToken(TOKEN_TYPE.LBracket, this.char);
        break;
      case "]":
        token = this.newToken(TOKEN_TYPE.RBracket, this.char);
        break;
      case ";":
        token = this.newToken(TOKEN_TYPE.Semicolon, this.char);
        break;
      case "\0":
        token = this.newToken(TOKEN_TYPE.EOF, "<eof>");
        break;
      default:
        if (this.isLetter(this.char)) {
          const literal = this.readIdentifier();
          return new Token(lookupIdentifier(literal), literal);
        }

        if (this.isNumber(this.char)) {
          return new Token(TOKEN_TYPE.Number, this.readNumber());
        }

        token = this.newToken(TOKEN_TYPE.Illegal, this.char);
    }

    this.readChar();
    return token;
  }

  private readString(): string | null {
    let output = "";
    this.readChar(); // Skip the initial quote
    let escape = false;
    while (this.char != '"' || escape) {
      if (this.char == "\n") return null; // Early EoL
      if (escape) {
        output += this.char;
        escape = false;
      } else {
        if (this.char == "\\") {
          escape = true;
        } else {
          output += this.char;
        }
      }
      this.readChar();
    }

    return output;
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

    while (this.isAlphaNumeric(this.char)) {
      this.readChar();
    }

    return this.source.slice(position, this.pos);
  }

  private skipComment() {
    while (this.char === "#") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      while (this.char !== "\n" && this.char !== "\0") {
        this.readChar();
      }
      this.skipWhitespace();
    }
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
    return ("a" <= char && char <= "z") || ("A" <= char && char <= "Z") || char === "_";
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isNumber(char) || this.isLetter(char);
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

  private isAtEnd(): boolean {
    return this.readPos >= this.source.length;
  }
}
