import { Lexer } from "./lexer";
import { TOKEN_TYPE, Token, TokenType } from "./token";
import * as ast from "./ast";

/**
 * ParserError is a sentinel class used for managing parser
 * synchronization after detecting syntax error.
 */
class ParserError extends Error {}

/** Parser for ADOT language. */
export class Parser {
  errors: Array<string> = [];

  private currToken: Token;
  private peekToken: Token;

  constructor(private readonly lexer: Lexer) {
    this.currToken = lexer.nextToken();
    this.peekToken = lexer.nextToken();
  }

  public parse(): ast.Definition | undefined {
    const definition = new ast.Definition();

    while (!this.currTokenIs(TOKEN_TYPE.EOF)) {
      try {
        const graph = this.parseGraph();
        if (graph) {
          definition.graphs.push(graph);
        }

        this.nextToken();
      } catch (error) {
        // TODO: Top level sync (we want to search for another graph definition)
      }
    }

    return definition;
  }

  private sync() {
    console.error("Not implemented");
  }

  private parseGraph(): ast.GraphStatement | undefined {
    switch (this.currToken.type) {
      case TOKEN_TYPE.Graph:
      case TOKEN_TYPE.Digraph:
        try {
          return this.parseStatementsList();
        } catch (error) {
          // Synchronize if we fail to parse a graph statement
          // to "validate" as much code as possible.
          this.sync();
          return undefined;
        }
      default:
        throw this.error(this.currToken, "Expected a graph statement.");
    }
  }

  private parseStatementsList(): ast.GraphStatement {
    const token = this.currToken;
    const statements: Array<ast.Statement> = [];

    this.expectPeek(TOKEN_TYPE.LBrace);
    this.nextToken();

    while (!this.currTokenIs([TOKEN_TYPE.RBrace, TOKEN_TYPE.EOF])) {
      const statement = this.parseStatement();

      if (Array.isArray(statement)) {
        statements.push(...statement);
      } else if (statement) {
        statements.push(statement);
      }

      this.nextToken();
    }

    return new ast.GraphStatement(token, statements);
  }

  private parseStatement(): Array<ast.Statement> | ast.Statement {
    switch (this.currToken.type) {
      case TOKEN_TYPE.Id: {
        if (this.peekTokenIs([TOKEN_TYPE.Edge, TOKEN_TYPE.DirectedEdge])) {
          return this.parseEdgeStatement();
        }

        return this.parseNodeStatement();
      }
      default:
        throw this.error(this.currToken, "Expected a statement.");
    }
  }

  private parseEdgeStatement(): Array<ast.EdgeStatement> {
    const statements: Array<ast.EdgeStatement> = [];

    while (this.peekTokenIs([TOKEN_TYPE.Edge, TOKEN_TYPE.DirectedEdge])) {
      const token = this.currToken;

      const left = this.parseIdentifier();
      this.nextToken();
      const edgeOp = this.currToken.literal as ast.EdgeType;
      this.nextToken();
      const right = this.parseIdentifier();

      statements.push(new ast.EdgeStatement(token, left, right, edgeOp));
    }

    this.nextToken();

    return statements;
  }

  private parseNodeStatement(): ast.NodeStatement {
    let attributesList: Array<ast.AttributeStatement> = [];

    const token = this.currToken;
    const id = this.parseIdentifier();

    if (this.peekTokenIs(TOKEN_TYPE.LBracket)) {
      this.nextToken();
      this.nextToken();
      attributesList = this.parseAttributesList();
    }

    this.nextTokenIfPeek(TOKEN_TYPE.Semicolon);

    return new ast.NodeStatement(token, id, attributesList);
  }

  private parseAttributesList(): Array<ast.AttributeStatement> {
    const attributes: Array<ast.AttributeStatement> = [];

    if (this.currTokenIs(TOKEN_TYPE.RBracket)) {
      return attributes;
    }

    attributes.push(this.parseAttribute());

    while (this.peekTokenIs(TOKEN_TYPE.Semicolon)) {
      this.nextToken();
      this.nextToken();

      const attribute = this.parseAttribute();

      if (attribute) {
        attributes.push(attribute);
      }
    }

    this.expectPeek(TOKEN_TYPE.RBracket);

    return attributes;
  }

  private parseAttribute(): ast.AttributeStatement {
    const token = this.currToken;

    const key = this.parseIdentifier();
    this.expectPeek(TOKEN_TYPE.Eq);
    this.nextToken();
    const value = this.parseExpression();

    return new ast.AttributeStatement(token, key, value);
  }

  private parseExpression(): ast.Expression {
    switch (this.currToken.type) {
      case TOKEN_TYPE.Id:
        return this.parseIdentifier();
      case TOKEN_TYPE.Number:
        return this.parseNumberLiteral();
      default:
        throw this.error(this.currToken, "Expected an expression");
    }
  }

  private parseNumberLiteral(): ast.NumberLiteral {
    return new ast.NumberLiteral(this.currToken, parseFloat(this.currToken.literal));
  }

  private parseIdentifier(): ast.Identifier {
    return new ast.Identifier(this.currToken, this.currToken.literal);
  }

  private nextToken(): void {
    this.currToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private nextTokenIfPeek(tokenType: TokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
    }
  }

  private expectPeek(expectedTypes: TokenType | Array<TokenType>): void {
    if (!this.peekTokenIs(expectedTypes)) {
      throw this.error(
        this.peekToken,
        `Expected: ${Array.isArray(expectedTypes) ? expectedTypes.join(" or ") : expectedTypes}`
      );
    }

    this.nextToken();
  }

  private currTokenIs(expectedTypes: TokenType | Array<TokenType>): boolean {
    return this.tokenIs(this.currToken, expectedTypes);
  }

  private peekTokenIs(expectedTypes: TokenType | Array<TokenType>): boolean {
    return this.tokenIs(this.peekToken, expectedTypes);
  }

  private tokenIs(token: Token, expectedTypes: TokenType | Array<TokenType>): boolean {
    if (!Array.isArray(expectedTypes)) {
      expectedTypes = [expectedTypes];
    }
    return expectedTypes.some((type) => token.type === type);
  }

  private error(token: Token, message: string): ParserError {
    this.errors.push(`at '${token.literal}' (${token.type}):\n\t${message}`);
    return new ParserError();
  }
}
