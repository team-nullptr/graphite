import { Edge, Graph, Vertex } from "../runner/graph";
import * as terms from "./gen/gdl.terms";
import { SyntaxNode, TreeCursor } from "@lezer/common";
import { parser } from "./gen/gdl";

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

export class GraphParser {
  private readonly cursor: TreeCursor;
  private readonly lineOffsets: number[];

  constructor(private readonly source: string) {
    // TODO: learn more about syntaxTree() and if it should be used here.
    const root = parser.parse(source);
    this.cursor = root.cursor();
    this.lineOffsets = this.findLinesOffsets();
  }

  parse(): Graph {
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
        default:
          break;
        // TODO: We should report "unexpected" nodes.
      }
    }

    return { edges, vertices };
  }

  private parseVertex(): Vertex {
    this.expect(terms.Id);
    const id = this.getLexeme(this.cursor.node);

    this.expect(terms.Value);
    const value = this.getLexeme(this.cursor.node);

    return new Vertex(id, parseFloat(value));
  }

  private parseEdge(directed: boolean): Edge {
    this.expect(terms.Id);
    const aId = this.getLexeme(this.cursor.node);

    this.expect(terms.Id);
    const bId = this.getLexeme(this.cursor.node);

    return new Edge(aId, bId, null, directed);
  }

  private parseWeightedEdge(directed: boolean): Edge {
    this.expect(terms.Id);
    const aId = this.getLexeme(this.cursor.node);

    this.expect(terms.Value);
    const value = this.getLexeme(this.cursor.node);

    this.expect(terms.Id);
    const bId = this.getLexeme(this.cursor.node);

    return new Edge(aId, bId, parseFloat(value), directed);
  }

  private expect(termId: number) {
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

  private offsetToLine(offset: number) {
    let left = 0;
    let right = this.lineOffsets.length - 1;

    while (left < right) {
      const mid = Math.ceil(left + (right - left) / 2);

      if (offset > this.lineOffsets[mid]) left = mid;
      else if (offset < this.lineOffsets[mid]) right = mid - 1;
    }

    return left + 1;
  }

  private findLinesOffsets() {
    const linesOffsets = [0];

    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i] === "\n") {
        linesOffsets.push(i);
      }
    }

    return linesOffsets;
  }
}
