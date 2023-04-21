import { LiteralExpr } from "./expr";

export abstract class Stmt {}

export class VertexStmt extends Stmt {
  constructor(
    public readonly id: LiteralExpr,
    public readonly value: LiteralExpr
  ) {
    super();
  }
}

export class EdgeStmt extends Stmt {
  constructor(public readonly a: LiteralExpr, public readonly b: LiteralExpr) {
    super();
  }
}
