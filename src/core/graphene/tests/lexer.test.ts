import { test, expect } from "vitest";
import { Lexer } from "../lexer";
import { Token } from "../token";

test("Lexer correctly scans all tokens", () => {
  const source = `vertex(  A)
edge(A, B, 2)`;

  const expectedTokens: Token[] = [
    new Token("IDENTIFIER", "vertex", 1, 0, 6),
    new Token("LEFT_PAREN", "(", 1, 6, 7),
    new Token("IDENTIFIER", "A", 1, 9, 10),
    new Token("RIGHT_PAREN", ")", 1, 10, 11),

    new Token("IDENTIFIER", "edge", 2, 12, 16),
    new Token("LEFT_PAREN", "(", 2, 16, 17),
    new Token("IDENTIFIER", "A", 2, 17, 18),
    new Token("COMMA", ",", 2, 18, 19),
    new Token("IDENTIFIER", "B", 2, 20, 21),
    new Token("COMMA", ",", 2, 21, 22),
    new Token("NUMBER", "2", 2, 23, 24, 2),
    new Token("RIGHT_PAREN", ")", 2, 24, 25),

    new Token("EOF", "", 2, 25, 25),
  ];

  const lexer = new Lexer(source);
  const receivedTokens = lexer.lex();

  expect(receivedTokens).toEqual(expectedTokens);
});
