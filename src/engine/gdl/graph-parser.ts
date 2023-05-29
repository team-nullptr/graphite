import { Edge, Graph, Vertex } from "../runner/graph";
import * as terms from "./gen/gdl.terms";
import { SyntaxNode, TreeCursor } from "@lezer/common";
import { parser } from "./gen/gdl";
import { nanoid } from "nanoid";

export class ParseError extends Error {
  constructor(
    public readonly line: number,
    public readonly precedingNode: SyntaxNode,
    public readonly node: SyntaxNode,
    message: string
  ) {
    super(message);
  }
}

// TODO: There probably is a lot of possible optimisations.
export class GraphParser {
  private readonly cursor: TreeCursor;
  private readonly lineOffsets: number[];

  private edges: Record<string, Edge> = {};
  private vertices: Record<string, Vertex> = {};

  constructor(private readonly source: string) {
    // TODO: learn more about syntaxTree() and if it should be used here.
    const root = parser.parse(source);
    this.cursor = root.cursor();
    this.lineOffsets = this.findLinesOffsets();
  }

  parse(): Graph {
    while (this.cursor.next()) {
      switch (this.cursor.node.type.id) {
        case terms.Vertex:
          this.parseVertex();
          break;
        case terms.Edge:
          this.parseEdge(false);
          break;
        case terms.DirectedEdge:
          this.parseEdge(true);
          break;
        case terms.WeightedEdge:
          this.parseWeightedEdge(false);
          break;
        case terms.WeightedDirectedEdge:
          this.parseWeightedEdge(true);
          break;
        case terms.Program:
          break;
        default:
          break;
        // TODO: We should report "unexpected" nodes.
      }
    }

    return {
      edges: this.edges,
      vertices: this.vertices,
    };
  }

  private parseVertex(): void {
    this.expect(terms.Id);
    const id = this.getLexeme(this.cursor.node);

    this.expect(terms.Value);
    const value = this.getLexeme(this.cursor.node);

    this.vertices[id] = new Vertex(id, parseFloat(value));
  }

  private parseEdge(directed: boolean): void {
    this.expect(terms.Id);
    const from = this.getLexeme(this.cursor.node);

    this.expect(terms.Id);
    const to = this.getLexeme(this.cursor.node);

    const id = nanoid();
    // TODO: Do we want to default the weight to 1?
    const edge = new Edge(id, from, to, 1, directed);
    this.edges[id] = edge;
    this.connectVertices(edge);
  }

  private parseWeightedEdge(directed: boolean): void {
    this.expect(terms.Id);
    const from = this.getLexeme(this.cursor.node);

    this.expect(terms.Value);
    const value = this.getLexeme(this.cursor.node);

    this.expect(terms.Id);
    const to = this.getLexeme(this.cursor.node);

    const id = nanoid();
    const edge = new Edge(id, from, to, parseFloat(value), directed);
    this.edges[id] = edge;
    this.connectVertices(edge);
  }

  private expect(termId: number): void {
    const precedingNode = this.cursor.node;

    if (!(this.cursor.next() && this.cursor.node.type.id === termId))
      throw new ParseError(
        this.offsetToLine(precedingNode.from),
        precedingNode,
        this.cursor.node,
        `(${parser.getName(
          precedingNode.type.id
        )}) must be followed by (${parser.getName(termId)}).`
      );
  }

  private getLexeme(node: SyntaxNode): string {
    return this.source.slice(node.from, node.to);
  }

  private offsetToLine(offset: number): number {
    let left = 0;
    let right = this.lineOffsets.length - 1;

    while (left < right) {
      const mid = Math.ceil(left + (right - left) / 2);

      if (offset > this.lineOffsets[mid]) left = mid;
      else if (offset < this.lineOffsets[mid]) right = mid - 1;
    }

    return left + 1;
  }

  private findLinesOffsets(): number[] {
    const linesOffsets = [0];

    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i] === "\n") {
        linesOffsets.push(i);
      }
    }

    return linesOffsets;
  }

  private connectVertices({ from, to, directed, id }: Edge): void {
    this.vertices[from].outs.push(id);
    this.vertices[to].ins.push(id);

    if (!directed) {
      this.vertices[from].ins.push(id);
      this.vertices[to].outs.push(id);
    }
  }
}
