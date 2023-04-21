export type TokenType = "VERTEX" | "EDGE" | "STRING" | "NUMBER";

export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly lexeme: string,
    public readonly literal: unknown,
    public readonly line: number
  ) {}
}
