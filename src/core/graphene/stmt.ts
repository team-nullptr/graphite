import { Expr } from "./expr";

export interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
}

export interface Statement {
  accept<R>(visitor: Visitor<R>): R;
}

export class Expression implements Statement {
  constructor(public readonly expression: Expr) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
