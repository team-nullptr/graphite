import { nanoid } from "nanoid";
import { Edge, Graph, Vertex } from "../simulator/graph";
import { Callable, CallableArg } from "./callable";
import {
  Call,
  Expr,
  Visitor as ExprVisitor,
  Literal,
  Variable,
  VertexReference,
} from "./expr";
import { Expression, Statement, Visitor as StmtVisitor } from "./stmt";
import { Token } from "./token";

class ExecError extends Error {
  constructor(public readonly token: Token, message: string) {
    super(`[line ${token.line}] Error at '${token.lexeme}': ${message}`);
  }
}

class Environment {
  constructor(private readonly values: Map<string, unknown>) {}

  get(name: Token): unknown {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new ExecError(name, `Undefined variable.`);
  }
}

export class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
  // TODO: Is there any way to create those global functions outside of this class?
  private environment = new Environment(
    new Map([
      [
        "vertex",
        new (class extends Callable {
          arity = 2;
          args = ["name", "value"];

          validateArgsType(args: CallableArg[]) {
            const [id, value] = args;

            if (typeof id.value !== "string" && !(id.value instanceof String)) {
              throw new ExecError(args[0].token, "Invalid vertex id.");
            }

            if (
              typeof value.value !== "number" &&
              !(value.value instanceof Number)
            ) {
              throw new ExecError(args[1].token, "Value must be a number.");
            }
          }

          call(interpreter: Interpreter, args: CallableArg[]) {
            const [id, value] = args.map(({ value }) => value) as [
              string,
              number
            ];

            interpreter.vertices[id] = new Vertex(id, value);
          }
        })(),
      ],
      [
        "edge",
        new (class extends Callable {
          arity = 3;
          args = ["from", "to", "weight"];

          validateArgsType(args: CallableArg[]) {
            const [from, to, weight] = args;

            if (
              typeof from.value !== "string" &&
              !(from.value instanceof String)
            ) {
              throw new ExecError(args[0].token, "Invalid vertex id.");
            }

            if (typeof to.value !== "string" && !(to.value instanceof String)) {
              throw new ExecError(args[1].token, "Invalid vertex id.");
            }

            if (
              typeof weight.value !== "number" &&
              !(weight.value instanceof Number)
            ) {
              throw new ExecError(args[2].token, "Value must be a number.");
            }
          }

          call(interpreter: Interpreter, args: CallableArg[]) {
            const [from, to, weight] = args.map(({ value }) => value) as [
              string,
              string,
              number
            ];

            const id = nanoid();

            console.log(id, from, to, weight);
            interpreter.edges[id] = new Edge(id, from, to, weight, false);
          }
        })(),
      ],
    ])
  );

  private edges: Record<string, Edge> = {};
  private vertices: Record<string, Vertex> = {};

  constructor(private readonly stmts: Statement[]) {}

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

  visitCallExpr(expr: Call): unknown {
    const calle = this.evaluate(expr.calle);

    if (!(calle instanceof Callable)) {
      throw new ExecError(expr.paren, "Only functions can be called.");
    }

    const args: CallableArg[] = [];

    for (const arg of expr.args) {
      args.push({
        token: arg.token,
        value: this.evaluate(arg),
      });
    }

    // TODO: We could list missing arguments in the error message.
    if (args.length !== calle.arity) {
      throw new ExecError(
        expr.paren,
        `Expected ${calle.arity} arguments but got ${args.length}.`
      );
    }

    calle.validateArgsType(args);

    return calle.call(this, args);
  }

  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitVariableExpr(expr: Variable): unknown {
    return this.environment.get(expr.token);
  }

  visitVertexReferenceExpr(expr: VertexReference): string {
    return expr.token.lexeme;
  }

  private execute(stmt: Statement) {
    stmt.accept(this);
  }

  private evaluate(expr: Expr): unknown {
    return expr.accept(this);
  }
}
