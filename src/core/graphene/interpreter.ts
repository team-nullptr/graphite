import { nanoid } from "nanoid";
import { Edge, Graph, Vertex } from "../simulator/graph";
import { Callable, CallableArg } from "./callable";
import {
  Call,
  Expr,
  Visitor as ExprVisitor,
  NumberLiteral,
  Variable,
  VertexLiteral,
} from "./expr";
import { Expression, Statement, Visitor as StmtVisitor } from "./stmt";
import { Token } from "./token";
import { Obj } from "./object";

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

// TODO: Move this somewhere
const expectVertexArg = (arg: CallableArg): string => {
  if (arg.obj.type !== "VERTEX") {
    throw new ExecError(arg.token, "Expected a vertex id.");
  }

  return arg.obj.value;
};

// TODO: Move this somewhere
const expectNumberArg = (arg: CallableArg): number => {
  if (arg.obj.type !== "NUMBER") {
    throw new ExecError(arg.token, "Expected a number.");
  }

  return arg.obj.value;
};

export class Interpreter implements ExprVisitor<Obj>, StmtVisitor<void> {
  // TODO: Is there any way to create those global functions outside of this class?
  private environment = new Environment(
    new Map<string, Callable>([
      [
        "vertex",
        new (class extends Callable {
          arity = 2;

          call(interpreter: Interpreter, args: CallableArg[]): void {
            const id = expectVertexArg(args[0]);
            const value = expectNumberArg(args[1]);

            interpreter.vertices[id] = new Vertex(id, value);
          }
        })(),
      ],
      [
        "edge",
        new (class extends Callable {
          arity = 3;

          call(interpreter: Interpreter, args: CallableArg[]): void {
            const id = nanoid();
            const from = expectVertexArg(args[0]);
            const to = expectVertexArg(args[1]);
            const weight = expectNumberArg(args[2]);

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

  visitCallExpr(expr: Call): Obj {
    const calle = this.evaluate(expr.calle);

    if (!(calle instanceof Callable)) {
      throw new ExecError(expr.paren, "Only functions can be called.");
    }

    const args: CallableArg[] = [];

    for (const arg of expr.args) {
      args.push({
        token: arg.token,
        obj: this.evaluate(arg),
      });
    }

    // TODO: We could list missing arguments in the error message.
    if (args.length !== calle.arity) {
      throw new ExecError(
        expr.paren,
        `Expected ${calle.arity} arguments but got ${args.length}.`
      );
    }

    calle.call(this, args);

    // TODO: Make call a statement.
    return { type: "VOID" };
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
