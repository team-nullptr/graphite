import { Lexer } from "./lexer";
import { TOKEN_TYPE, Token, TokenType } from "./token";
import * as ast from "./ast";

export function errorFmtAt(at: Token, message: string): string {
  return `At '${at.literal}' [${at.type}]:\n\t${message}\n`;
}

export function errorFmtExpected(at: Token, expected: Array<TokenType>): string {
  return errorFmtAt(
    at,
    Array.length > 0 ? `Expected one of [${expected.join("], [")}].` : `Expected [${expected}].`
  );
}

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
        definition.graphs.push(graph);
      } catch (error) {
        this.synchronizeGraphDefinition();
      }

      this.nextToken();
    }

    return definition;
  }

  private parseGraph(): ast.GraphStatement {
    const at = this.currToken;

    if (!this.currTokenIs(TOKEN_TYPE.Graph, TOKEN_TYPE.Digraph, TOKEN_TYPE.Subgraph)) {
      throw this.error(errorFmtAt(this.currToken, "Expected graph declaration."));
    }

    let statementsList: Array<ast.Statement> = [];
    this.expectPeek(TOKEN_TYPE.LBrace);

    if (!this.peekTokenIs(TOKEN_TYPE.RBrace)) {
      this.nextToken();
      statementsList = this.parseStatementsList();
    }

    this.expectPeek(TOKEN_TYPE.RBrace);

    return new ast.GraphStatement(at, statementsList);
  }

  private parseStatementsList(): Array<ast.Statement> {
    const statements: Array<ast.Statement> = [];

    // NOTE: We know to watch for RBrace as it's the only token which can
    // end statements list (other than EOF).

    while (!this.peekTokenIs(TOKEN_TYPE.EOF)) {
      try {
        const statement = this.parseStatement();

        // Chained edge statements can produce an array of statements
        // TODO: Maybe there is a cleaner way to
        if (Array.isArray(statement)) {
          statements.push(...statement);
        } else {
          statements.push(statement);
        }
      } catch (error) {
        this.synchronizeToStatement();
      }

      if (this.peekTokenIs(TOKEN_TYPE.RBrace)) {
        break;
      }

      this.expectPeek(TOKEN_TYPE.Id, TOKEN_TYPE.Subgraph);
    }

    return statements;
  }

  private parseStatement(): Array<ast.Statement> | ast.Statement {
    if (this.currTokenIs(TOKEN_TYPE.Subgraph)) {
      return this.parseGraph();
    }

    if (this.peekTokenIs(TOKEN_TYPE.Edge, TOKEN_TYPE.DirectedEdge)) {
      return this.parseEdgeStatement();
    }

    return this.parseNodeStatement();
  }

  private parseEdgeStatement(): Array<ast.EdgeStatement> {
    const statements: Array<ast.EdgeStatement> = [];

    while (this.peekTokenIs(TOKEN_TYPE.Edge, TOKEN_TYPE.DirectedEdge)) {
      const at = this.currToken;

      // TODO: Add support for subgraphs in edge statments

      const left = this.parseIdentifier();
      this.nextToken();
      const edgeOp = this.currToken.literal as ast.EdgeType;
      this.expectPeek(TOKEN_TYPE.Id, TOKEN_TYPE.Subgraph);
      const right = this.parseIdentifier();

      // NOTE: We don't consume the right token deliberately
      // so that we can chain edge statements together.

      statements.push(new ast.EdgeStatement(at, left, right, edgeOp, []));
    }

    let attributesList: Array<ast.AttributeStatement> = [];
    if (this.peekTokenIs(TOKEN_TYPE.LBracket)) {
      this.nextToken();
      this.nextToken();
      attributesList = this.parseAttributesList();
    }

    for (const statement of statements) {
      // We are not deep copying the attributes list here,
      // so keep in mind that changes to it will be propagated
      // to all of the nodes in the edge statement chain.
      statement.attributeList = attributesList;
    }

    this.nextTokenIfPeek(TOKEN_TYPE.Semicolon);

    return statements;
  }

  private parseNodeStatement(): ast.NodeStatement {
    const at = this.currToken;
    const id = this.parseIdentifier();

    let attributesList: Array<ast.AttributeStatement> = [];
    if (this.peekTokenIs(TOKEN_TYPE.LBracket)) {
      this.nextToken();
      this.nextToken();
      attributesList = this.parseAttributesList();
    }

    this.nextTokenIfPeek(TOKEN_TYPE.Semicolon);

    return new ast.NodeStatement(at, id, attributesList);
  }

  private parseAttributesList(): Array<ast.AttributeStatement> {
    if (this.currTokenIs(TOKEN_TYPE.RBracket)) {
      return [];
    }

    const attributes: Array<ast.AttributeStatement> = [this.parseAttribute()];

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
    const at = this.currToken;

    const key = this.parseIdentifier();
    this.expectPeek(TOKEN_TYPE.Eq);
    this.nextToken();
    const value = this.parseExpression();

    return new ast.AttributeStatement(at, key, value);
  }

  private parseExpression(): ast.Expression {
    switch (this.currToken.type) {
      case TOKEN_TYPE.Id:
        return this.parseIdentifier();
      case TOKEN_TYPE.Number:
        return this.parseNumberLiteral();
      case TOKEN_TYPE.String:
        return this.parseStringLiteral();
      default:
        throw this.error(errorFmtAt(this.currToken, "Expected an expression."));
    }
  }

  private parseNumberLiteral(): ast.NumberLiteral {
    return new ast.NumberLiteral(this.currToken, parseFloat(this.currToken.literal));
  }

  private parseStringLiteral(): ast.StringLiteral {
    return new ast.StringLiteral(this.currToken, this.currToken.literal);
  }

  private parseIdentifier(): ast.Identifier {
    return new ast.Identifier(this.currToken, this.currToken.literal);
  }

  /** Synchronizes parser after encountering syntax error inside statements list. */
  private synchronizeToStatement() {
    while (!this.peekTokenIs(TOKEN_TYPE.EOF, TOKEN_TYPE.RBrace)) {
      this.nextToken();

      if (this.currTokenIs(TOKEN_TYPE.Semicolon)) {
        return;
      }

      switch (this.peekToken.type) {
        case TOKEN_TYPE.RBrace:
          return;
      }
    }
  }

  /** Synchronizes parser to the next top-level graph definition. */
  private synchronizeGraphDefinition() {
    while (!this.currTokenIs(TOKEN_TYPE.RBrace, TOKEN_TYPE.EOF)) {
      this.nextToken();
    }
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

  private expectPeek(...expectedTypes: Array<TokenType>): void {
    if (!this.peekTokenIs(...expectedTypes)) {
      throw this.error(errorFmtExpected(this.peekToken, expectedTypes));
    }

    this.nextToken();
  }

  private currTokenIs(...expectedTypes: Array<TokenType>): boolean {
    return this.tokenIs(this.currToken, expectedTypes);
  }

  private peekTokenIs(...expectedTypes: Array<TokenType>): boolean {
    return this.tokenIs(this.peekToken, expectedTypes);
  }

  private tokenIs(token: Token, expectedTypes: Array<TokenType>): boolean {
    return expectedTypes.some((type) => token.type === type);
  }

  private error(message: string): ParserError {
    this.errors.push(message);
    return new ParserError();
  }
}
