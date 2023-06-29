import { Expr, Literal } from "./expr";
import { Token } from "./token";

export interface Visitor<R> {
  visitCallStmt(stmt: Call): R;
}

export interface Statement {
  accept<R>(visitor: Visitor<R>): R;
}

export class Call implements Statement {
  constructor(
    public readonly calle: Expr,
    public readonly paren: Token,
    public readonly args: Literal[]
  ) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitCallStmt(this);
  }
}
