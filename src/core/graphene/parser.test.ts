import { expect, test } from "vitest";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Expression } from "./stmt";
import { Call, Variable, VertexReference } from "./expr";
import { Token } from "./token";

test("Parser works as expected", () => {
  const source = `vertex(A)`;

  const expectedStmts = [
    new Expression(
      new Call(
        new Variable(new Token("IDENTIFIER", "vertex", 1)),
        new Token("RIGHT_PAREN", ")", 1),
        [new VertexReference(new Token("IDENTIFIER", "A", 1))]
      )
    ),
  ];

  const lexer = new Lexer(source);
  const tokens = lexer.lex();
  const parser = new Parser(tokens);

  const receivedStmts = parser.parse();
  expect(receivedStmts).toStrictEqual(expectedStmts);
});
