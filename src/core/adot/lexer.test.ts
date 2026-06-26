import { test, assert, describe } from "vitest";
import { Lexer } from "./lexer";
import { TOKEN_TYPE } from "./token";

const TEST_DEBUG = process.env.TEST_DEBUG === "1";

describe("Lexer next token", () => {
  const source = `graph {
    # aaaa
    a -> b0
    a -- b;
    c [cost=10.23]
    c -- d0 [cost=10]

    x -- y [name="test"]
}

test {}

subgraph
`;

  const lexer = new Lexer(source);

  test.each([
    // graph {
    [TOKEN_TYPE.Graph, "graph"],
    [TOKEN_TYPE.LBrace, "{"],

    // a -> b
    [TOKEN_TYPE.Id, "a"],
    [TOKEN_TYPE.DirectedEdge, "->"],
    [TOKEN_TYPE.Id, "b0"],

    // a -- b
    [TOKEN_TYPE.Id, "a"],
    [TOKEN_TYPE.Edge, "--"],
    [TOKEN_TYPE.Id, "b"],
    ["SEMICOLON", ";"],

    // c [cost=10.23]
    [TOKEN_TYPE.Id, "c"],
    [TOKEN_TYPE.LBracket, "["],
    [TOKEN_TYPE.Id, "cost"],
    [TOKEN_TYPE.Eq, "="],
    [TOKEN_TYPE.Number, "10.23"],
    [TOKEN_TYPE.RBracket, "]"],

    // c -- d [cost=10]
    [TOKEN_TYPE.Id, "c"],
    [TOKEN_TYPE.Edge, "--"],
    [TOKEN_TYPE.Id, "d0"],
    [TOKEN_TYPE.LBracket, "["],
    [TOKEN_TYPE.Id, "cost"],
    [TOKEN_TYPE.Eq, "="],
    [TOKEN_TYPE.Number, "10"],
    [TOKEN_TYPE.RBracket, "]"],

    // x -- y [name="test"]
    [TOKEN_TYPE.Id, "x"],
    [TOKEN_TYPE.Edge, "--"],
    [TOKEN_TYPE.Id, "y"],
    [TOKEN_TYPE.LBracket, "["],
    [TOKEN_TYPE.Id, "name"],
    [TOKEN_TYPE.Eq, "="],
    [TOKEN_TYPE.String, "test"],
    [TOKEN_TYPE.RBracket, "]"],

    // }
    [TOKEN_TYPE.RBrace, "}"],

    [TOKEN_TYPE.Id, "test"],
    [TOKEN_TYPE.LBrace, "{"],
    [TOKEN_TYPE.RBrace, "}"],
    [TOKEN_TYPE.Subgraph, "subgraph"],
    [TOKEN_TYPE.EOF, "<eof>"],
  ])("%s is %s", (expectedTokenType, expectedLiteral) => {
    const token = lexer.nextToken();

    if (TEST_DEBUG) {
      console.log(token, expectedLiteral);
    }

    assert.strictEqual(token.type, expectedTokenType);
    assert.strictEqual(token.literal, expectedLiteral);
  });
});
