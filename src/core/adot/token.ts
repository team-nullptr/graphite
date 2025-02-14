export type TokenType =
  | "ID"
  | "NUMBER"
  | "GRAPH"
  | "DIGRAPH"
  | "DIRECTED_EDGE"
  | "EDGE"
  | "SEMICOLON"
  | "LBRACE"
  | "RBRACE"
  | "LBRACKET"
  | "RBRACKET"
  | "EQ"
  | "ILLEGAL"
  | "EOF";

const keywords: Record<string, TokenType> = {
  graph: "GRAPH",
  digraph: "DIGRAPH",
};

export function lookupIdentifier(literal: string): TokenType {
  return keywords[literal.toLowerCase()] ?? "ID";
}

/** Represents a token produced by DOT lexer. */
export class Token {
  constructor(public readonly type: TokenType, public readonly literal: string) {}
}
