import { test, assert, describe } from "vitest";
import { Lexer } from "./lexer";
import { TokenType } from "./token";

describe("next token", () => {
  const source = `graph {
    a -> b
    a -- b;
    c [cost=10.23]
    c -- d [cost=10]
}`;

  const lexer = new Lexer(source);

  const tests: Array<[TokenType, string]> = [
    // graph {
    ["GRAPH", "graph"],
    ["LBRACE", "{"],

    // a -> b
    ["ID", "a"],
    ["DIRECTED_EDGE", "->"],
    ["ID", "b"],

    // a -- b
    ["ID", "a"],
    ["EDGE", "--"],
    ["ID", "b"],
    ["SEMICOLON", ";"],

    // c [cost=10.23]
    ["ID", "c"],
    ["LBRACKET", "["],
    ["ID", "cost"],
    ["EQ", "="],
    ["NUMBER", "10.23"],
    ["RBRACKET", "]"],

    // c -- d [cost=10]
    ["ID", "c"],
    ["EDGE", "--"],
    ["ID", "d"],
    ["LBRACKET", "["],
    ["ID", "cost"],
    ["EQ", "="],
    ["NUMBER", "10"],
    ["RBRACKET", "]"],

    // }
    ["RBRACE", "}"],
    ["EOF", ""],
  ];

  for (const [expectedTokenType, expectedLiteral] of tests) {
    test("", () => {
      const token = lexer.nextToken();
      assert.strictEqual(token.type, expectedTokenType);
      assert.strictEqual(token.literal, expectedLiteral);
    });
  }
});
