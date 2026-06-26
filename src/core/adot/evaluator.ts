import { Edge, Graph, Vertex } from "../simulator/graph";
import * as ast from "./ast";

export class Evaluator {
  constructor(private readonly definition?: ast.Definition) {}

  eval(): Array<Graph> {
    if (!this.definition || this.definition.graphs.length == 0) {
      return [];
    }

    // TODO: We probably need some identifier to distinguish graphs
    // from each other.
    const graphs: Array<Graph> = [];

    for (const graph of this.definition.graphs) {
      const evaluatedGraph: Graph = { edges: {}, vertices: {} };
      this.evalGraphStatement(graph, evaluatedGraph);
      graphs.push(evaluatedGraph);
    }

    return graphs;
  }

  private evalGraphStatement(graphStatement: ast.GraphStatement, graph: Graph) {
    for (const stmt of graphStatement.statements) {
      if (stmt instanceof ast.NodeStatement) {
        this.evalNodeStatement(stmt, graph);
      }

      if (stmt instanceof ast.EdgeStatement) {
        this.evalEdgeStatement(stmt, graph);
      }
    }
  }

  private evalNodeStatement(nodeStatement: ast.NodeStatement, graph: Graph) {
    // TODO: Do something cool with attributes
    const attributes = this.evalAttributesList(nodeStatement.attributesList);

    graph.vertices[nodeStatement.id.value] = new Vertex(
      nodeStatement.id.value,
      attributes["cost"] && typeof attributes["cost"] === "number" ? attributes["cost"] : 0
    );
  }

  private evalEdgeStatement(stmt: ast.EdgeStatement, graph: Graph) {
    const leftId = stmt.left.value;
    if (!graph.vertices[leftId]) {
      graph.vertices[leftId] = new Vertex(leftId, 0);
    }

    const rightId = stmt.right.value;
    if (!graph.vertices[rightId]) {
      graph.vertices[rightId] = new Vertex(rightId, 0);
    }

    const attributesList = this.evalAttributesList(stmt.attributeList);
    const isDirected = stmt.edgeType === "->";

    const edgeId = crypto.randomUUID();
    const edge = new Edge(
      edgeId,
      leftId,
      rightId,
      attributesList["cost"] && typeof attributesList["cost"] === "number"
        ? attributesList["cost"]
        : null,
      attributesList["name"] && typeof attributesList["name"] === "string"
        ? attributesList["name"]
        : null,
      isDirected
    );

    const leftVertex = graph.vertices[leftId];
    const rightVertex = graph.vertices[rightId];

    leftVertex.outs.push(edgeId);
    rightVertex.ins.push(edgeId);

    if (!isDirected) {
      leftVertex.ins.push(edgeId);
      rightVertex.outs.push(edgeId);
    }

    graph.edges[edgeId] = edge;
  }

  private evalAttributesList(
    stmts: Array<ast.AttributeStatement>
  ): Record<string, string | number> {
    const attributes: Record<string, string | number> = {};

    for (const attrStmt of stmts) {
      // This a bit hacky, but it works as value can't be
      // anything other than number at the moment.
      const key = attrStmt.key.value;
      const value = (attrStmt.value as ast.Identifier | ast.NumberLiteral).value;
      attributes[key] = value;
    }

    return attributes;
  }
}
