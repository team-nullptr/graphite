import { Token } from "./token";

export interface Expr {
  accept<R>(visitor: Visitor<R>): R;
}

export interface Visitor<R> {
  visitLiteralExpr(expr: Literal): R;
  visitCallExpr(expr: Call): R;
  visitVariableExpr(expr: Variable): R;
  visitVertexReferenceExpr(expr: VertexReference): R;
}

export class Literal implements Expr {
  constructor(public readonly token: Token, public readonly value: unknown) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}
export class Variable implements Expr {
  constructor(public readonly token: Token) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVariableExpr(this);
  }
}

export class VertexReference implements Expr {
  constructor(public readonly token: Token) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVertexReferenceExpr(this);
  }
}

export type ArgumentExpr = Literal | VertexReference;

export class Call implements Expr {
  constructor(
    public readonly calle: Expr,
    public readonly paren: Token,
    public readonly args: ArgumentExpr[]
  ) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitCallExpr(this);
  }
}
