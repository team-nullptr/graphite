import { nanoid } from "nanoid";
import { Edge, Graph, Vertex } from "../simulator/graph";
import { Callable } from "./callable";
import {
  Expr,
  Visitor as ExprVisitor,
  NumberLiteral,
  Variable,
  VertexLiteral,
} from "./expr";
import { Call } from "./stmt";
import { Statement, Visitor as StmtVisitor } from "./stmt";
import { Token } from "./token";
import { Obj, assertNumber, assertVertex } from "./object";

class ExecError extends Error {
  constructor(public readonly token: Token, message: string) {
    super(`[line ${token.line}] Error at '${token.lexeme}': ${message}`);
  }
}

class Environment {
  constructor(private readonly values: Map<string, Callable>) {}

  get(name: Token): Callable {
    if (this.values.has(name.lexeme)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.values.get(name.lexeme)!;
    }

    throw new ExecError(name, `Undefined variable.`);
  }
}

export class Interpreter implements ExprVisitor<Obj>, StmtVisitor<void> {
  // TODO: Is there any way to create those global functions outside of this class?
  private environment = new Environment(
    new Map<string, Callable>([
      [
        "vertex",
        new (class extends Callable {
          arity = { min: 1, max: 2 };

          call(interpreter: Interpreter, args: Obj[]): void {
            const id = assertVertex(args[0]);
            const value = args[1] ? assertNumber(args[1]) : 1;

            interpreter.vertices[id] = new Vertex(id, value);
          }
        })(),
      ],
      [
        "edge",
        new (class extends Callable {
          arity = { min: 2, max: 3 };

          call(interpreter: Interpreter, args: Obj[]): void {
            const id = nanoid();
            const from = assertVertex(args[0]);
            const to = assertVertex(args[1]);
            const weight = args[2] ? assertNumber(args[2]) : 1;

            // TODO: This is broken ...
            interpreter.edges[id] = new Edge(id, from, to, weight, false);
            interpreter.vertices[from].outs.push(id);
            interpreter.vertices[from].ins.push(id);

            interpreter.vertices[to].ins.push(id);
            interpreter.vertices[to].outs.push(id);
          }
        })(),
      ],
      [
        "arc",
        new (class extends Callable {
          arity = { min: 2, max: 3 };

          call(interpreter: Interpreter, args: Obj[]): void {
            const id = nanoid();
            const from = assertVertex(args[0]);
            const to = assertVertex(args[1]);
            const weight = args[2] ? assertNumber(args[2]) : 1;

            interpreter.edges[id] = new Edge(id, from, to, weight, true);
            interpreter.vertices[from].outs.push(id);
            interpreter.vertices[to].ins.push(id);
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

  visitCallStmt(expr: Call): void {
    const calle = this.evaluate(expr.calle);

    if (!(calle instanceof Callable)) {
      throw new ExecError(expr.paren, "Only functions can be called.");
    }

    const args: Obj[] = [];
    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }

    // TODO: We could list missing arguments in the error message.
    if (args.length < calle.arity.min || args.length > calle.arity.max) {
      throw new ExecError(
        expr.paren,
        `Expected between ${calle.arity.min}-${calle.arity.max} arguments but got ${args.length}.`
      );
    }

    calle.call(this, args);
  }

  visitVertexLiteral(expr: VertexLiteral): Obj {
    return {
      type: "VERTEX",
      value: expr.value,
    };
  }

  visitNumberLiteral(expr: NumberLiteral): Obj {
    return {
      type: "NUMBER",
      value: expr.value,
    };
  }

  visitVariableExpr(expr: Variable): Callable {
    return this.environment.get(expr.token);
  }

  private execute(stmt: Statement) {
    stmt.accept(this);
  }

  private evaluate(expr: Expr): Obj {
    return expr.accept(this);
  }
}
