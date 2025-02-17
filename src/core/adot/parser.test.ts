import { assert, describe, test } from "vitest";
import * as ast from "./ast";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Token, TOKEN_TYPE } from "./token";
import util from "util";

// TODO: Write utils for hand writing asts

describe("Correctly parses valid definitions", () => {
  test.each<[string, ast.Node]>([
    [
      `graph {
      a

      ;}`,
      (() => {
        const a = new Token(TOKEN_TYPE.Id, "a");

        return new ast.Definition([
          new ast.GraphStatement(new Token(TOKEN_TYPE.Graph, "graph"), [
            new ast.NodeStatement(a, new ast.Identifier(a, a.literal), []),
          ]),
        ]);
      })(),
    ],
    [
      `

      graph {
      a[]
      b ;
      }`,
      (() => {
        const a = new Token(TOKEN_TYPE.Id, "a");
        const b = new Token(TOKEN_TYPE.Id, "b");

        return new ast.Definition([
          new ast.GraphStatement(new Token(TOKEN_TYPE.Graph, "graph"), [
            new ast.NodeStatement(a, new ast.Identifier(a, a.literal), []),
            new ast.NodeStatement(b, new ast.Identifier(b, b.literal), []),
          ]),
        ]);
      })(),
    ],
    [
      `

      graph {
      a -> b -> a;
      }`,
      (() => {
        const a = new Token(TOKEN_TYPE.Id, "a");
        const b = new Token(TOKEN_TYPE.Id, "b");

        return new ast.Definition([
          new ast.GraphStatement(new Token(TOKEN_TYPE.Graph, "graph"), [
            new ast.EdgeStatement(
              a,
              new ast.Identifier(a, a.literal),
              new ast.Identifier(b, b.literal),
              "->"
            ),
            new ast.EdgeStatement(
              b,
              new ast.Identifier(b, b.literal),
              new ast.Identifier(a, a.literal),
              "->"
            ),
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

          c [        cost=45.6]

          d;
          e [cost=1

          ]
          }`,
      (() => {
        const a = new Token(TOKEN_TYPE.Id, "a");
        const b = new Token(TOKEN_TYPE.Id, "b");
        const c = new Token(TOKEN_TYPE.Id, "c");
        const d = new Token(TOKEN_TYPE.Id, "d");
        const e = new Token(TOKEN_TYPE.Id, "e");
        const cost = new Token(TOKEN_TYPE.Id, "cost");
        const color = new Token(TOKEN_TYPE.Id, "color");
        const orange = new Token(TOKEN_TYPE.Id, "orange");

        return new ast.Definition([
          new ast.GraphStatement(new Token(TOKEN_TYPE.Graph, "graph"), [
            new ast.NodeStatement(a, new ast.Identifier(a, a.literal), [
              new ast.AttributeStatement(
                cost,
                new ast.Identifier(cost, cost.literal),
                new ast.NumberLiteral(new Token(TOKEN_TYPE.Number, "45"), 45)
              ),
            ]),
            new ast.NodeStatement(b, new ast.Identifier(b, b.literal), [
              new ast.AttributeStatement(
                color,
                new ast.Identifier(color, color.literal),
                new ast.Identifier(orange, orange.literal)
              ),
            ]),
            new ast.NodeStatement(c, new ast.Identifier(c, c.literal), [
              new ast.AttributeStatement(
                cost,
                new ast.Identifier(cost, cost.literal),
                new ast.NumberLiteral(new Token(TOKEN_TYPE.Number, "45.6"), 45.6)
              ),
            ]),
            new ast.NodeStatement(d, new ast.Identifier(d, d.literal), []),
            new ast.NodeStatement(e, new ast.Identifier(e, e.literal), [
              new ast.AttributeStatement(
                cost,
                new ast.Identifier(cost, cost.literal),
                new ast.NumberLiteral(new Token(TOKEN_TYPE.Number, "1"), 1)
              ),
            ]),
          ]),
        ]);
      })(),
    ],
  ])("Case %#", (source, want) => {
    const lexer = new Lexer(source);
    const parser = new Parser(lexer);
    const got = parser.parse();
    console.log(source);
    console.log(util.inspect(got, { depth: null, compact: false, colors: true }));
    console.log(parser.errors);
    assert.deepEqual(got, want);
  });
});
