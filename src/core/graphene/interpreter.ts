import { Callable } from "./callable";
import { Environment } from "./environment";
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

export class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
  private vertices: string[] = [];
  private stmts: Stmt[];

  private globals: Record<string, unknown> = {
    vertex: {
      call(interpreter, [vertexName]) {
        interpreter.vertices.push(vertexName as string);
      },
    } as Callable,
  };

  private environment = new Environment(new Map(Object.entries(this.globals)));

  constructor(source: string) {
    const lexer = new Lexer(source);
    const parser = new Parser(lexer.lex());
    this.stmts = parser.parse();
  }

  forge(): string[] {
    for (const stmt of this.stmts) {
      this.execute(stmt);
    }

    return this.vertices;
  }

  visitExpressionStmt(stmt: Expression): void {
    this.evaluate(stmt.expression);
  }

  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitCallExpr(expr: Call): unknown {
    const calle = this.evaluate(expr.calle);

    const args: unknown[] = [];
    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }

    return (calle as Callable).call(this, args);
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
