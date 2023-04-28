import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  Vertex as VertexTerm,
  Edge as EdgeTerm,
  Id as IdTerm,
  Value as ValueTerm,
} from "./gdl/gen/gdl.terms";

export class Vertex {
  constructor(
    public readonly id: string,
    public value: number,
    public readonly inEdges: Edge[] = [],
    public readonly outEdges: Edge[] = []
  ) {}
}

export class Edge {
  constructor(
    public readonly id: string,
    public readonly from: Vertex,
    public readonly to: Vertex,
    public weight: number,
    public readonly directed: boolean
  ) {}
}

export class Graph {
  readonly vertices: Vertex[] = [];
  readonly edges: Edge[] = [];

  /** Adds a veretx. */
  addVertex(id: string, value: number) {
    if (!this.validateVertex(id)) {
      throw new Error("Duplicate vertex id!");
    }

    const vertex = new Vertex(id, value);

    this.vertices.push(vertex);

    return vertex;
  }

  /** Adds an edge. */
  addEdge(from: string, to: string, weight: number, directed = false): Edge {
    const fromVertex = this.vertices.find((it) => it.id === from);
    if (!fromVertex) throw new Error("From vertex does not exist");

    const toVertex = this.vertices.find((it) => it.id === to);
    if (!toVertex) throw new Error("To vertex does not exist");

    const edge = new Edge(
      `e-${this.edges.length}`,
      fromVertex,
      toVertex,
      weight,
      directed
    );

    this.connectEdge(edge, fromVertex, toVertex);
    this.connectEdge(edge, toVertex, fromVertex);
    this.edges.push(edge);

    return edge;
  }

  /** Adds the edge to vertices' out and in edges arrays. */
  private connectEdge(edge: Edge, from: Vertex, to: Vertex): void {
    from.outEdges.push(edge);
    to.inEdges.push(edge);
  }

  /** Checks if vertex has a unique id in current graph context. */
  private validateVertex(id: string) {
    return !this.vertices.some((it) => it.id === id);
  }
}

export const graphFromSource = (state: EditorState): Graph => {
  const graph = new Graph();
  const tree = syntaxTree(state);

  tree.topNode
    .getChildren("Statement")
    // Sort statements so that all verticies are created before creating edges.
    .sort((stmt) => (stmt.type.id === VertexTerm ? -1 : 1))
    .forEach((stmt) => {
      switch (stmt.type.id) {
        case VertexTerm: {
          const idNode = stmt.getChild(IdTerm);
          if (!idNode) throw new Error("Expected Id node");

          const valueNode = stmt.getChild(ValueTerm);
          if (!valueNode) throw new Error("Expected Value node");

          const idLiteral = state.sliceDoc(idNode.from, idNode.to);
          const valueLiteral = parseFloat(
            state.sliceDoc(valueNode.from, valueNode.to)
          );

          graph.addVertex(idLiteral, valueLiteral);
          break;
        }
        case EdgeTerm: {
          const ids = stmt.getChildren(IdTerm);

          const fromIdNode = ids[0];
          if (!fromIdNode) throw new Error("Expected from Id node");

          const toIdNode = ids[1];
          if (!toIdNode) throw new Error("Expected to Id node");

          const fromIdLiteral = state.sliceDoc(fromIdNode.from, fromIdNode.to);
          const toIdLiteral = state.sliceDoc(toIdNode.from, toIdNode.to);

          // TODO: Add gdl support for directed edges and weighs
          graph.addEdge(fromIdLiteral, toIdLiteral, 1, false);
          break;
        }
      }
    });

  return graph;
};
