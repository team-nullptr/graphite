import { assert, describe, test } from "vitest";
import * as ast from "./ast";
import { Lexer } from "./lexer";
import { errorFmtAt, errorFmtExpected, Parser } from "./parser";
import { Token, TOKEN_TYPE } from "./token";

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
      a ->
      b -> a;

      a
      -- b
      a -- b

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
            new ast.EdgeStatement(
              a,
              new ast.Identifier(a, a.literal),
              new ast.Identifier(b, b.literal),
              "--"
            ),
            new ast.EdgeStatement(
              a,
              new ast.Identifier(a, a.literal),
              new ast.Identifier(b, b.literal),
              "--"
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
    const ast = parser.parse();

    // console.log(source);
    // console.log(parser.errors);
    // console.log(util.inspect(ast, { depth: null, compact: false, colors: true }));

    assert.isEmpty(parser.errors);
    assert.deepEqual(ast, want);
  });
});

describe("Reports syntax errors correctly", () => {
  test.each<[string, Array<string>]>([
    [`graph {`, [errorFmtExpected(new Token(TOKEN_TYPE.EOF, "<eof>"), [TOKEN_TYPE.RBrace])]],
    [
      `

      graph {
        a ->

      }`,
      [errorFmtExpected(new Token(TOKEN_TYPE.RBrace, "}"), [TOKEN_TYPE.Id])],
    ],
    [
      `graph {
      a ->
      b --
      c [cost=10];
      }

      foo {}
      bar {}
      digraph { a; b; }`,
      [
        errorFmtExpected(new Token(TOKEN_TYPE.LBracket, "["), [TOKEN_TYPE.Id]),
        errorFmtAt(new Token(TOKEN_TYPE.Id, "foo"), "Expected graph declaration."),
        errorFmtAt(new Token(TOKEN_TYPE.Id, "bar"), "Expected graph declaration."),
      ],
    ],
  ])("Case %#", (source, expectedErrors) => {
    const lexer = new Lexer(source);
    const parser = new Parser(lexer);
    parser.parse();

    // console.log(source);
    // console.log(parser.errors.join("\n"));

    assert.deepEqual(parser.errors, expectedErrors);
    assert.isNotEmpty(parser.errors);
  });
});
