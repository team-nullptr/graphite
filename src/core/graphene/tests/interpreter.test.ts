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

test("Edges are added correctly", () => {
  // arrange
  const source = `
vertex(A)  
vertex(B)

edge(A, B)
edge(A, B, 5)

arc(A, B)
arc(A, B, 5)
`;

  const tokens = new Lexer(source).lex();
  const stmts = new Parser(tokens).parse();
  const interpreter = new Interpreter(stmts);

  // act
  const got = interpreter.forge();

  // assert
  expect(Object.keys(got.edges)).toHaveLength(4);
});
