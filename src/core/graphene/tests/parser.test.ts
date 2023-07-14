import { expect, test } from "vitest";
import { Lexer } from "../lexer";
import { Parser } from "../parser";
import { Call } from "../stmt";
import {
  Variable,
  VertexLiteral,
  NumberLiteral,
  VertexCollection,
} from "../expr";
import { Token } from "../token";

test("Parser parses Graphene syntax correctly", () => {
  // arrange
  const source = `vertex(A, 4, [C, D])`;
  const tokens = new Lexer(source).lex();

  const want = [
    new Call(
      new Variable(new Token("IDENTIFIER", "vertex", 1, 0, 6)),
      new Token("RIGHT_PAREN", ")", 1, 19, 20),
      [
        new VertexLiteral(new Token("IDENTIFIER", "A", 1, 7, 8), "A"),
        new NumberLiteral(new Token("NUMBER", "4", 1, 10, 11, 4), 4),
        new VertexCollection(new Token("RIGHT_SQ_BRACKET", "]", 1, 18, 19), [
          new VertexLiteral(new Token("IDENTIFIER", "C", 1, 14, 15), "C"),
          new VertexLiteral(new Token("IDENTIFIER", "D", 1, 17, 18), "D"),
        ]),
      ]
    ),
  ];

  // act
  const got = new Parser(tokens).parse();

  // assert
  expect(got).toStrictEqual(want);
});

test.each([
  `vertex(vertex())`,
  `34`,
  `vertex(,)`,
  `()`,
  `vertex(A)vertex(B)`,
  `vertex(`,
])("Report syntax error for '%s'", (source) => {
  // arrange
  const tokens = new Lexer(source).lex();
  const parser = new Parser(tokens);

  // assert
  expect(() => parser.parse()).toThrowError();
});
