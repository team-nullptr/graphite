import { test, expect } from "vitest";
import { Lexer } from "./lexer";
import { Token } from "./token";

test("Lexer correctly scans all tokens", () => {
  const source = `vertex A
vertex B
A.edge(B).weight(69)
B.direct(A).weight(420)`;

  const validTokens: Token[] = [
    new Token("VERTEX", "vertex", 1),
    new Token("IDENTIFIER", "A", 1),
    new Token("VERTEX", "vertex", 2),
    new Token("IDENTIFIER", "B", 2),
    new Token("IDENTIFIER", "A", 3),
    new Token("DOT", ".", 3),
    new Token("IDENTIFIER", "edge", 3),
    new Token("LEFT_PAREN", "(", 3),
    new Token("IDENTIFIER", "B", 3),
    new Token("RIGHT_PAREN", ")", 3),
    new Token("DOT", ".", 3),
    new Token("IDENTIFIER", "weight", 3),
    new Token("LEFT_PAREN", "(", 3),
    new Token("NUMBER", "69", 3, 69),
    new Token("RIGHT_PAREN", ")", 3),
    new Token("IDENTIFIER", "B", 4),
    new Token("DOT", ".", 4),
    new Token("IDENTIFIER", "direct", 4),
    new Token("LEFT_PAREN", "(", 4),
    new Token("IDENTIFIER", "A", 4),
    new Token("RIGHT_PAREN", ")", 4),
    new Token("DOT", ".", 4),
    new Token("IDENTIFIER", "weight", 4),
    new Token("LEFT_PAREN", "(", 4),
    new Token("NUMBER", "420", 4, 420),
    new Token("RIGHT_PAREN", ")", 4),
    new Token("EOF", "", 4),
  ];

  const lexer = new Lexer(source);
  const tokens = lexer.lex();

  expect(tokens).toEqual(validTokens);
});
