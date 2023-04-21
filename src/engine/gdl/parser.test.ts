import { describe, expect, it } from "vitest";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { EdgeStmt, VertexStmt } from "./stmt";
import { LiteralExpr } from "./expr";
import { Stmt } from "./stmt";

describe("GDL parser works properly.", () => {
  it("case 1", () => {
    // arrange
    const source = "vertex A 1\nvertex B 2\nedge A B";

    const lexer = new Lexer();
    lexer.load(source);
    const tokens = lexer.scanTokens();

    const parser = new Parser();
    parser.load(tokens);

    const want: Stmt[] = [
      new VertexStmt(new LiteralExpr("A"), new LiteralExpr(1)),
      new VertexStmt(new LiteralExpr("B"), new LiteralExpr(2)),
      new EdgeStmt(new LiteralExpr("A"), new LiteralExpr("B")),
    ];

    // act
    const got = parser.parse();

    // assert
    expect(got).toEqual(want);
  });
});
