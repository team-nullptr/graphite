import { nanoid } from "nanoid";
import { Edge, Graph, Vertex } from "../../engine/runner/graph";
import { Callable } from "./callable";
import {
  Call,
  Expr,
  Visitor as ExprVisitor,
  Literal,
  Variable,
  VertexReference,
} from "./expr";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Expression, Stmt, Visitor as StmtVisitor } from "./stmt";
import { Token } from "./token";

class RuntimeError extends Error {
  constructor(public readonly token: Token, message: string) {
    super(message);
  }
}

class Environment {
  constructor(private readonly values: Map<string, unknown>) {}

  get(name: Token): unknown {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new Error(`Undefined variable '${name.lexeme}'.`);
  }
}

export class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
  private environment = new Environment(
    new Map([
      [
        "vertex",
        new (class extends Callable {
          arity = 2;

          call(interpreter: Interpreter, [id]: unknown[]) {
            interpreter.vertices[id as string] = new Vertex(id as string, 1);
          }
        })(),
      ],
      [
        "edge",
        new (class extends Callable {
          arity = 3;

          call(interpreter: Interpreter, [fromId, toId]: unknown[]) {
            const id = nanoid();

            interpreter.edges[id] = new Edge(
              id,
              fromId as string,
              toId as string,
              1,
              false
            );
          }
        })(),
      ],
    ])
  );

  private edges: Record<string, Edge> = {};
  private vertices: Record<string, Vertex> = {};

  constructor(private readonly stmts: Stmt[]) {}

  forge(): Graph {
    for (const stmt of this.stmts) {
      this.execute(stmt);
    }

    return {
      edges: this.edges,
      vertices: this.vertices,
    };
  }

  visitExpressionStmt(stmt: Expression): void {
    this.evaluate(stmt.expression);
  }

  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitCallExpr(expr: Call): unknown {
    const calle = this.evaluate(expr.calle);

    if (!(calle instanceof Callable)) {
      throw new RuntimeError(expr.paren, "Only functions can be called.");
    }

    const args: unknown[] = [];
    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }

    if (args.length !== calle.arity) {
      throw new RuntimeError(
        expr.paren,
        `Expected ${calle.arity} arguments but got ${args.length}.`
      );
    }

    // TODO: Check argument types?

    return calle.call(this, args);
  }

  visitVertexReference(expr: VertexReference): string {
    return expr.name.lexeme;
  }

  visitVariableExpr(expr: Variable): unknown {
    return this.environment.get(expr.name);
  }

  private execute(stmt: Stmt) {
    stmt.accept(this);
  }

  private evaluate(expr: Expr): unknown {
    return expr.accept(this);
  }
}
