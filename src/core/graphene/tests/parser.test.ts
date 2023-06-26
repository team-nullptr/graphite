import { expect, test } from "vitest";
import { Lexer } from "../lexer";
import { Parser } from "../parser";
import { Expression } from "../stmt";
import { Call, Variable, VertexReference } from "../expr";
import { Token } from "../token";

test("Parser parses Graphene syntax correctly", () => {
  const source = `vertex(A)`;
  const tokens = new Lexer(source).lex();

  const want = [
    new Expression(
      new Call(
        new Variable(new Token("IDENTIFIER", "vertex", 1)),
        new Token("RIGHT_PAREN", ")", 1),
        [new VertexReference(new Token("IDENTIFIER", "A", 1))]
      )
    ),
  ];

  const parser = new Parser(tokens);
  const got = parser.parse();

  expect(got).toStrictEqual(want);
});

test.each([`vertex(vertex())`, `34`, `vertex(,)`, `()`])(
  "Report syntax error for '%s'",
  (source) => {
    const tokens = new Lexer(source).lex();
    const parser = new Parser(tokens);
    expect(() => parser.parse()).toThrowError();
  }
);
