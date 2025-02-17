import { Lexer } from "./lexer";
import * as token from "./token";
import * as ast from "./ast";

/** Parser for ADOT language. */
export class Parser {
  currToken: token.Token;
  peekToken: token.Token;
  errors: Array<string> = [];

  constructor(private readonly lexer: Lexer) {
    this.currToken = lexer.nextToken();
    this.peekToken = lexer.nextToken();
  }

  private nextToken() {
    this.currToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  public parse(): ast.Definition {
    const definition = new ast.Definition();

    while (!this.currTokenIs("EOF")) {
      const graph = this.parseGraph();
      if (graph) {
        definition.graphs.push(graph);
      }
      this.nextToken();
    }
    console.log(this.errors);
    return definition;
  }

  private parseGraph(): ast.GraphStatement | undefined {
    switch (this.currToken.type) {
      case "GRAPH":
      case "DIGRAPH":
        return this.parseGraphStatement();
    }
  }

  private parseGraphStatement(): ast.GraphStatement | undefined {
    const token = this.currToken;
    const statements: Array<ast.Statement> = [];

    if (!this.expectPeek("LBRACE")) return undefined;
    this.nextToken();

    while (!this.currTokenIs("RBRACE") && !this.currTokenIs("EOF")) {
      const statement = this.parseStatements();
      if (Array.isArray(statement)) {
        statements.push(...statement); // TODO: Fix '!'
      } else if (statement) {
        statements.push(statement); // TODO: Fix '!'
      }
      this.nextToken();
    }

    return new ast.GraphStatement(token, statements);
  }

  private parseStatements(): Array<ast.Statement> | ast.Statement | undefined {
    switch (this.currToken.type) {
      // TODO: Add support for subgraphs
      case "ID": {
        if (this.peekTokenIs("EDGE") || this.peekTokenIs("DIRECTED_EDGE")) {
          return this.parseEdgeStatements();
        } else {
          return this.parseNodeStatement();
        }
        break;
      }
    }
  }

  private parseEdgeStatements(): Array<ast.EdgeStatement> | undefined {
    const statements: Array<ast.EdgeStatement> = [];

    while (this.peekTokenIs("EDGE") || this.peekTokenIs("DIRECTED_EDGE")) {
      const token = this.currToken;

      const left = this.parseIdentifier();
      if (!left) {
        return;
      }
      this.nextToken();

      const edgeOp = this.currToken.literal as ast.EdgeType;
      this.nextToken();

      const right = this.parseIdentifier();
      if (!right) {
        return;
      }

      statements.push(new ast.EdgeStatement(token, left, right, edgeOp));
    }
    return statements;
  }

  private parseNodeStatement(): ast.NodeStatement | undefined {
    const token = this.currToken;

    const id = this.parseIdentifier();
    if (!id) {
      return;
    }

    let attributesList: Array<ast.AttributeStatement> = [];

    if (this.peekTokenIs("LBRACKET")) {
      this.nextToken();
      this.nextToken();
      attributesList = this.parseAttributesList();
    }

    if (this.peekTokenIs("SEMICOLON")) this.nextToken();

    return new ast.NodeStatement(token, id, attributesList);
  }

  private parseAttributesList(): Array<ast.AttributeStatement> {
    const attributes: Array<ast.AttributeStatement> = [];

    if (this.peekTokenIs("RBRACKET")) {
      this.nextToken();
      return attributes;
    }

    attributes.push(this.parseAttribute()!);

    while (this.peekTokenIs("SEMICOLON")) {
      this.nextToken();
      this.nextToken();
      const attribute = this.parseAttribute();
      if (attribute) {
        attributes.push(attribute);
      }
    }

    if (!this.expectPeek("RBRACKET")) return [];

    return attributes;
  }

  private parseAttribute(): ast.AttributeStatement | undefined {
    const token = this.currToken;

    const key = this.parseIdentifier();
    if (!key) {
      return;
    }

    if (!this.expectPeek("EQ")) return;
    this.nextToken();

    const value = this.parseExpression();
    if (!value) {
      return;
    }

    return new ast.AttributeStatement(token, key, value);
  }

  private parseExpression(): ast.Expression | undefined {
    switch (this.currToken.type) {
      case "NUMBER":
        return this.parseNumberLiteral();
      case "ID":
        return this.parseIdentifier();
    }
  }

  private parseNumberLiteral(): ast.NumberLiteral | undefined {
    if (!this.currTokenIs("NUMBER")) {
      this.errors.push("Expected a number, got", this.currToken.type);
      return;
    }

    return new ast.NumberLiteral(this.currToken, parseFloat(this.currToken.literal));
  }

  private parseIdentifier(): ast.Identifier | undefined {
    if (!this.currTokenIs("ID")) {
      this.errors.push("Expected an ID, got", this.currToken.type);
      return;
    }

    return new ast.Identifier(this.currToken, this.currToken.literal);
  }

  private expectPeek(expectedType: token.TokenType | Array<token.TokenType>): boolean {
    if (
      Array.isArray(expectedType)
        ? expectedType.some((token) => this.peekTokenIs(token))
        : this.peekTokenIs(expectedType)
    ) {
      this.nextToken();
      return true;
    }

    this.peekError(expectedType);
    return false;
  }

  private currTokenIs(expectedType: token.TokenType): boolean {
    return this.currToken.type === expectedType;
  }

  private peekTokenIs(expectedType: token.TokenType): boolean {
    return this.peekToken.type === expectedType;
  }

  private peekError(expectedType: token.TokenType | Array<token.TokenType>) {
    if (Array.isArray(expectedType))
      this.errors.push(
        `Expected next token to be one of ${expectedType.join(",")}, got ${
          this.currToken.type
        } instead`
      );
    else
      this.errors.push(
        `Expected next token to be ${expectedType}, got ${this.currToken.type} instead`
      );
  }
}
