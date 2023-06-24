export type TokenType =
  // single-character tokens
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "DOT"

  // Literals
  | "IDENTIFIER"
  | "NUMBER"

  // Keywords
  | "VERTEX"

  // Misc
  | "EOF";
