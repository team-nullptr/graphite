import { describe, expect, test } from "vitest";
import { GraphParser } from "./graph-parser";

describe("test graph parser", () => {
  test("parses vertex correctly", () => {
    // arrange
    const source = `a 1
b 2
c 3`;

    const parser = new GraphParser(source);

    // act
    const graph = parser.parse();

    // assert
    expect(graph.vertices.size).toBe(3);
    expect(graph.vertices.get("a")?.value).toBe(1);
  });

  test.each([
    {
      edgeStmt: "a -> b",
      expected: { directed: false, weight: null },
    },
    {
      edgeStmt: "a [10]-> b",
      expected: { directed: false, weight: 10 },
    },
    {
      edgeStmt: "a <-> b",
      expected: { directed: true, weight: null },
    },
    {
      edgeStmt: "a [10]<-> b",
      expected: { directed: true, weight: 10 },
    },
  ])("parses $edge edge correctly", ({ edgeStmt, expected }) => {
    // arrange
    const source = `a 1\nb 2\n${edgeStmt}`;
    const parser = new GraphParser(source);

    // act
    const graph = parser.parse();

    // assert
    const [parsedEdge] = graph.getEdges();
    expect(parsedEdge.directed).toBe(expected.directed);
    expect(parsedEdge.weight).toBe(expected.weight);
  });
});
