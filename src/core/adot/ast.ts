import { Token } from "./token";

export type EdgeType = "--" | "->";

// TODO: I am not sure if this classification does even make
// any sense in case of graph declaration language.
export abstract class Node {}
export abstract class Statement extends Node {}
export abstract class Expression extends Node {}

export class Definition extends Node {
  constructor(public graphs: Array<GraphStatement> = []) {
    super();
  }
}

export class GraphStatement extends Statement {
  constructor(public token: Token, public statements: Array<Statement> = []) {
    super();
  }
}

export class NodeStatement extends Statement {
  constructor(
    public token: Token,
    public id: Identifier,
    public attributesList: Array<AttributeStatement>
  ) {
    super();
  }
}

export class EdgeStatement extends Statement {
  constructor(
    public token: Token,
    public left: Identifier,
    public right: Identifier,
    public edgeType: EdgeType,
    public attributeList: Array<AttributeStatement>
  ) {
    super();
  }
}

export class AttributeStatement extends Statement {
  constructor(public readonly token: Token, public key: Identifier, public value: Expression) {
    super();
  }
}

export class NumberLiteral extends Expression {
  constructor(public readonly token: Token, public value: number) {
    super();
  }
}

export class StringLiteral extends Expression {
  constructor(public readonly token: Token, public value: string) {
    super();
  }
}

export class Identifier extends Expression {
  constructor(public readonly token: Token, public value: string) {
    super();
  }
}
