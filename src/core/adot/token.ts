export const TOKEN_TYPE = {
  Id: "ID",
  Number: "NUMBER",
  Graph: "GRAPH",
  Digraph: "DIGRAPH",
  DirectedEdge: "DIRECTED_EDGE",
  Edge: "EDGE",
  Semicolon: "SEMICOLON",
  LBrace: "LBRACE",
  RBrace: "RBRACE",
  LBracket: "LBRACKET",
  RBracket: "RBRACKET",
  Eq: "EQ",
  Illegal: "ILLEGAL",
  EOF: "EOF",
} as const;

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

const keywords: Record<string, TokenType> = {
  graph: TOKEN_TYPE.Graph,
  digraph: TOKEN_TYPE.Digraph,
};

export function lookupIdentifier(literal: string): TokenType {
  return keywords[literal.toLowerCase()] ?? TOKEN_TYPE.Id;
}

/** Represents a token produced by DOT lexer. */
export class Token {
  constructor(public readonly type: TokenType, public readonly literal: string) {}
}
