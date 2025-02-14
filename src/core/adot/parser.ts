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
      if (graph) definition.graphs.push(graph);
      this.nextToken();
    }

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
      statements.push(this.parseStatement()!); // TODO: Fix '!'
      this.nextToken();
    }

    return new ast.GraphStatement(token, statements);
  }

  private parseStatement(): ast.Statement | undefined {
    switch (this.currToken.type) {
      // TODO: Add support for subgraphs
      case "ID": {
        if (this.peekTokenIs("EDGE") || this.peekTokenIs("DIRECTED_EDGE"))
          console.error("not implemented");
        else return this.parseNodeStatement();
        break;
      }
    }
  }

  private parseNodeStatement(): ast.NodeStatement | undefined {
    const token = this.currToken;
    const id = this.parseIdentifier();
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
      attributes.push(this.parseAttribute()!);
    }

    if (!this.expectPeek("RBRACKET")) return [];

    return attributes;
  }

  private parseAttribute(): ast.AttributeStatement | undefined {
    const token = this.currToken;
    const key = this.parseIdentifier();

    if (!this.expectPeek("EQ")) return undefined;
    this.nextToken();

    const value = this.parseExpression()!;

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

  private parseNumberLiteral(): ast.NumberLiteral {
    return new ast.NumberLiteral(this.currToken, parseFloat(this.currToken.literal));
  }

  private parseIdentifier(): ast.Identifier {
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
