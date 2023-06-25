export type TokenType =
  // single-character tokens
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "DOT"
  | "COMMA"

  // Literals
  | "IDENTIFIER"
  | "NUMBER"

  // Misc
  | "EOF";
