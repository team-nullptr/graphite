import { Expr } from "./expr";

export interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
}

export interface Stmt {
  accept<R>(visitor: Visitor<R>): R;
}

export class Expression implements Stmt {
  constructor(public readonly expression: Expr) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
