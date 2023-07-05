export type TokenType =
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "COMMA"
  | "IDENTIFIER"
  | "NUMBER"
  | "LINE"
  | "EOF";

export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly lexeme: string,
    public readonly line: number,
    public readonly from: number,
    public readonly to: number,
    public readonly literal?: unknown
  ) {}
}
