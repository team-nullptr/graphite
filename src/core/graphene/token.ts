export type TokenType =
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "LEFT_SQ_BRACKET"
  | "RIGHT_SQ_BRACKET"
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
