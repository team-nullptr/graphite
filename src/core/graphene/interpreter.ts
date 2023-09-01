import { nanoid } from "nanoid";
import { Edge, Graph, Vertex } from "../simulator/graph";
import { Callable } from "./callable";
import {
  Expr,
  Visitor as ExprVisitor,
  NumberLiteral,
  Variable,
  VertexCollection,
  VertexLiteral,
} from "./expr";
import { Call } from "./stmt";
import { Statement, Visitor as StmtVisitor } from "./stmt";
import { Token } from "./token";
import { Obj, assertNumber, assertVertex } from "./object";
import { ArcFn, CompleteFn, EdgeFn, VertexFn } from "./std/callables";

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
  private environment = new Environment(
    new Map<string, Callable>([
      ["vertex", new VertexFn()],
      ["edge", new EdgeFn()],
      ["arc", new ArcFn()],
      ["complete", new CompleteFn()],
    ])
  );

  private edges: Record<string, Edge> = {};

  addEdge(key: string, edge: Edge) {
    this.edges[key] = edge;
  }

  getEdge(key: string): Edge {
    return this.edges[key];
  }

  private vertices: Record<string, Vertex> = {};

  addVertex(key: string, vertex: Vertex) {
    this.vertices[key] = vertex;
  }

  getVertex(key: string): Vertex {
    return this.vertices[key];
  }

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

  visitVertexCollection(expr: VertexCollection): Obj {
    const vertices: string[] = expr.vertices.map((vertex) => vertex.value);

    return {
      type: "VERTEX_COLLECTION",
      value: vertices,
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
