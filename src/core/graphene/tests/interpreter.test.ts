import { expect, test } from "vitest";
import { Interpreter } from "../interpreter";
import { Lexer } from "../lexer";
import { Parser } from "../parser";
import { Vertex } from "../../simulator/graph";

test("Vertices are added correctly", () => {
  // arrange
  const want = ["A", "B", "C", "D"];
  const source = want.map((vertex) => `vertex(${vertex}, 1)`).join("\n");

  const tokens = new Lexer(source).lex();
  const stmts = new Parser(tokens).parse();
  const interpreter = new Interpreter(stmts);

  // act
  const got = interpreter.forge();

  // assert
  expect(Object.values(got.vertices)).toEqual(
    want.map((id) => new Vertex(id, 1))
  );
});
