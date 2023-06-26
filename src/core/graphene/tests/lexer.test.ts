import { test, expect } from "vitest";
import { Lexer } from "../lexer";
import { Token } from "../token";

test("Lexer correctly scans all tokens", () => {
  const source = `vertex(A)
edge(A, B, 2)`;

  const expectedTokens: Token[] = [
    new Token("IDENTIFIER", "vertex", 1),
    new Token("LEFT_PAREN", "(", 1),
    new Token("IDENTIFIER", "A", 1),
    new Token("RIGHT_PAREN", ")", 1),

    new Token("IDENTIFIER", "edge", 2),
    new Token("LEFT_PAREN", "(", 2),
    new Token("IDENTIFIER", "A", 2),
    new Token("COMMA", ",", 2),
    new Token("IDENTIFIER", "B", 2),
    new Token("COMMA", ",", 2),
    new Token("NUMBER", "2", 2, 2),
    new Token("RIGHT_PAREN", ")", 2),
    new Token("EOF", "", 2),
  ];

  const lexer = new Lexer(source);
  const receivedTokens = lexer.lex();

  expect(receivedTokens).toEqual(expectedTokens);
});
