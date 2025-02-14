import { assert, describe, test } from "vitest";
import * as ast from "./ast";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Token } from "./token";
import util from "util";

describe("parse", () => {
  test.each<[string, ast.Node]>([
    [
      `graph {
      a

      ;}`,
      (() => {
        const a = new Token("ID", "a");

        return new ast.Definition([
          new ast.GraphStatement(new Token("GRAPH", "graph"), [
            new ast.NodeStatement(a, new ast.Identifier(a, a.literal), []),
          ]),
        ]);
      })(),
    ],
    [
      `

      graph {
      a;
      b ;
      }`,
      (() => {
        const a = new Token("ID", "a");
        const b = new Token("ID", "b");

        return new ast.Definition([
          new ast.GraphStatement(new Token("GRAPH", "graph"), [
            new ast.NodeStatement(a, new ast.Identifier(a, a.literal), []),
            new ast.NodeStatement(b, new ast.Identifier(b, b.literal), []),
          ]),
        ]);
      })(),
    ],
    [
      `graph

      { a [cost
      =  45] ;
          b [
          color = orange
          ]

          ;
          }`,
      (() => {
        const a = new Token("ID", "a");
        const b = new Token("ID", "b");
        const cost = new Token("ID", "cost");
        const color = new Token("ID", "color");
        const orange = new Token("ID", "orange");

        return new ast.Definition([
          new ast.GraphStatement(new Token("GRAPH", "graph"), [
            new ast.NodeStatement(a, new ast.Identifier(a, a.literal), [
              new ast.AttributeStatement(
                cost,
                new ast.Identifier(cost, cost.literal),
                new ast.NumberLiteral(new Token("NUMBER", "45"), 45)
              ),
            ]),
            new ast.NodeStatement(b, new ast.Identifier(b, b.literal), [
              new ast.AttributeStatement(
                color,
                new ast.Identifier(color, color.literal),
                new ast.Identifier(orange, orange.literal)
              ),
            ]),
          ]),
        ]);
      })(),
    ],
  ])("test %i", (source, want) => {
    const lexer = new Lexer(source);
    const parser = new Parser(lexer);
    const got = parser.parse();
    console.log(source);
    console.log(util.inspect(got, { depth: null, compact: false, colors: true }));
    assert.deepEqual(got, want);
  });
});
