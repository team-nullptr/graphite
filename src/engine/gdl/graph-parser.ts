import { EditorState } from "@codemirror/state";
import { Edge, Graph, Vertex } from "../graph";
import * as terms from "./gen/gdl.terms";
import { SyntaxNode, TreeCursor } from "@lezer/common";
import { syntaxTree } from "@codemirror/language";

export class GraphParser {
  private readonly cursor: TreeCursor;

  constructor(private readonly state: EditorState) {
    const root = syntaxTree(state);
    this.cursor = root.cursor();
  }

  parse(): Graph {
    const graph = new Graph();

    const edges: Edge[] = [];
    const vertices: Vertex[] = [];

    while (this.cursor.next()) {
      switch (this.cursor.node.type.id) {
        case terms.Vertex:
          vertices.push(this.parseVertex());
          break;
        case terms.Edge:
          edges.push(this.parseEdge(false));
          break;
        case terms.DirectedEdge:
          edges.push(this.parseEdge(true));
          break;
        case terms.WeightedEdge:
          edges.push(this.parseWeightedEdge(false));
          break;
        case terms.WeightedDirectedEdge:
          edges.push(this.parseWeightedEdge(true));
          break;
        case terms.Program:
          break;
      }
    }

    vertices.forEach((it) => graph.addVertex(it));
    edges.forEach((it) => graph.addEdge(it));

    return graph;
  }

  private parseVertex(): Vertex {
    if (!this.match(terms.Id)) throw new Error("Expected Id node");
    const id = this.getLexeme(this.cursor.node);

    if (!this.match(terms.Value)) throw new Error("Expected value node");
    const value = this.getLexeme(this.cursor.node);

    return new Vertex(id, parseFloat(value));
  }

  /** Parses edge. */
  private parseEdge(directed: boolean): Edge {
    if (!this.match(terms.Id)) throw new Error("Expected Id node");
    const aId = this.getLexeme(this.cursor.node);

    if (!this.match(terms.Id)) throw new Error("Expected Id node");
    const bId = this.getLexeme(this.cursor.node);

    return new Edge(aId, bId, null, directed);
  }

  /** Parses weighted edge. */
  private parseWeightedEdge(directed: boolean): Edge {
    if (!this.match(terms.Id)) throw new Error("Expected Id node");
    const aId = this.getLexeme(this.cursor.node);

    if (!this.match(terms.Value)) throw new Error("Expected Value node");
    const value = this.getLexeme(this.cursor.node);

    if (!this.match(terms.Id)) throw new Error("Expected Id node");
    const bId = this.getLexeme(this.cursor.node);

    return new Edge(aId, bId, parseFloat(value), directed);
  }

  /** Checks if the next node is of the given type. */
  private match(nodeType: number): boolean {
    return this.cursor.next() && this.cursor.node.type.id === nodeType;
  }

  /** Gets node's lexeme. */
  private getLexeme(node: SyntaxNode): string {
    return this.state.sliceDoc(node.from, node.to);
  }
}
