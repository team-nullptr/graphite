export type EofToken = {
  kind: "EOF";
};

export type VertexToken = {
  kind: "VERTEX";
};

export type EdgeToken = {
  kind: "EDGE";
};

export type StringToken = {
  kind: "STRING";
  literal: string;
};

export type NumberToken = {
  kind: "NUMBER";
  literal: number;
};

export type Token =
  | VertexToken
  | EdgeToken
  | StringToken
  | NumberToken
  | EofToken;
