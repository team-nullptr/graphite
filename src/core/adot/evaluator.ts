import { Edge, Graph, Vertex } from "../simulator/graph";
import * as ast from "./ast";

export class Evaluator {
  private edges: Record<string, Edge> = {};
  private vertices: Record<string, Vertex> = {};

  constructor(private readonly definition?: ast.Definition) {}

  eval(): Graph {
    if (!this.definition || this.definition.graphs.length == 0) {
      return { edges: {}, vertices: {} };
    }

    // Temporarily eval just the first graph definition.
    this.evalGraphStatement(this.definition.graphs[0]);

    return {
      edges: this.edges,
      vertices: this.vertices,
    };
  }

  private evalGraphStatement(graphStatement: ast.GraphStatement) {
    for (const statement of graphStatement.statements) {
      if (statement instanceof ast.NodeStatement) {
        this.evalNodeStatement(statement);
      }
    }
  }

  private evalNodeStatement(nodeStatement: ast.NodeStatement) {
    // TODO: Attribute evaluating
    this.vertices[nodeStatement.id.value] = new Vertex(nodeStatement.id.value, 0);
  }
}
