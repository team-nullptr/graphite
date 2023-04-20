import { describe, it, expect } from "vitest";
import { Lexer } from "./lexer";
import { Token } from "./tokens";

describe("test lexer", async () => {
  it("case 1", () => {
    const lexer = new Lexer();
    const source = "vertex A 1\nvertex B 2\nedge A B";
    const want: Token[] = [
      {
        kind: "VERTEX",
      },
      {
        kind: "STRING",
        literal: "A",
      },
      {
        kind: "NUMBER",
        literal: 1,
      },
      {
        kind: "VERTEX",
      },
      {
        kind: "STRING",
        literal: "B",
      },
      {
        kind: "NUMBER",
        literal: 2,
      },
      {
        kind: "EDGE",
      },
      {
        kind: "STRING",
        literal: "A",
      },
      {
        kind: "STRING",
        literal: "B",
      },
      {
        kind: "EOF",
      },
    ];

    lexer.load(source);
    const got = lexer.scanTokens();

    expect(got).toEqual(want);
  });
});
