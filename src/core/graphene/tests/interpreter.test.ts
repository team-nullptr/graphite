import { expect, test } from "vitest";
import { Interpreter } from "../interpreter";
import { Lexer } from "../lexer";
import { Parser } from "../parser";
import { Vertex } from "../../simulator/graph";

test("Vertices are added correctly", () => {
  // arrange
  const source = `
vertex(A)
vertex(B, 23)
`;

  const tokens = new Lexer(source).lex();
  const stmts = new Parser(tokens).parse();
  const interpreter = new Interpreter(stmts);

  // act
  const got = interpreter.forge();

  // assert
  expect(Object.values(got.vertices)).toEqual([
    new Vertex("A", 1),
    new Vertex("B", 23),
  ]);
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
  const edges = Object.values(got.edges);

  const directed = edges.filter((edge) => edge.directed);
  expect(directed).toHaveLength(2);

  const undirected = edges.filter((edge) => !edge.directed);
  expect(undirected).toHaveLength(2);
});
