import { Token } from "./token";

export interface Expr {
  accept<R>(visitor: Visitor<R>): R;
}

export interface Visitor<R> {
  visitLiteralExpr(expr: Literal): R;
  visitCallExpr(expr: Call): R;
  visitVariableExpr(expr: Variable): R;
  visitVertexReference(expr: VertexReference): R;
}

export class Literal implements Expr {
  constructor(public readonly value: unknown) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class Call implements Expr {
  constructor(
    public readonly calle: Expr,
    public readonly paren: Token,
    public readonly args: Expr[]
  ) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitCallExpr(this);
  }
}

export class Variable implements Expr {
  constructor(public readonly name: Token) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVariableExpr(this);
  }
}

export class VertexReference implements Expr {
  constructor(public readonly name: Token) {}

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVertexReference(this);
  }
}
