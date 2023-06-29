import { Callable } from "./callable";
import { Token } from "./token";

export interface Expr {
  accept<R>(visitor: Visitor<R>): R;
}

export interface Visitor<R> {
  visitVertexLiteral(expr: VertexLiteral): R;
  visitNumberLiteral(expr: NumberLiteral): R;

  // TODO: This should also return R. The problem is that Graphene does not have user-devlarable variables
  // and variable will always evaluate to a globally defined function. Changing this would require
  // writing useless code, so I leave this like that for now.
  visitVariableExpr(expr: Variable): Callable;
}

export class VertexLiteral implements Expr {
  constructor(public readonly token: Token, public readonly value: string) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVertexLiteral(this);
  }
}

export class NumberLiteral implements Expr {
  constructor(public readonly token: Token, public readonly value: number) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitNumberLiteral(this);
  }
}

export class Variable implements Expr {
  constructor(public readonly token: Token) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVariableExpr(this) as R;
  }
}

export type Literal = NumberLiteral | VertexLiteral;
