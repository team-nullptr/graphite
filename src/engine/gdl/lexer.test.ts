import { describe, it, expect } from "vitest";
import { Lexer } from "./lexer";
import { Token } from "./tokens";

describe("test lexer", async () => {
  it("case 1", () => {
    // arrange
    const source = "vertex A 1\nvertex B 2\nedge A B";

    const lexer = new Lexer();

    const want: Token[] = [
      new Token("VERTEX", "vertex", undefined, 0),
      new Token("STRING", "A", "A", 0),
      new Token("NUMBER", "1", 1, 0),

      new Token("VERTEX", "vertex", undefined, 1),
      new Token("STRING", "B", "B", 1),
      new Token("NUMBER", "2", 2, 1),

      new Token("EDGE", "edge", undefined, 2),
      new Token("STRING", "A", "A", 2),
      new Token("STRING", "B", "B", 2),
    ];

    // act
    lexer.load(source);
    const got = lexer.scanTokens();

    // assert
    expect(got).toEqual(want);
  });
});
