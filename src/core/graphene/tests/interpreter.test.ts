import { expect, test } from "vitest";
import { Interpreter } from "../interpreter";

test("Vertices are added correctly", () => {
  const expectedVertices = ["A", "B", "C", "D"];
  const source = expectedVertices
    .map((vertex) => `vertex(${vertex})`)
    .join("\n");

  const interpreter = new Interpreter(source);
  const receivedVertices = interpreter.forge();

  expect(receivedVertices).toEqual(expectedVertices);
});
