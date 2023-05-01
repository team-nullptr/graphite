import { nanoid } from "nanoid";

export class Vertex {
  constructor(
    public readonly id: string,
    public value: number,
    public readonly inEdges: string[] = [],
    public readonly outEdges: string[] = []
  ) {}
}

export class Edge {
  readonly id = nanoid();

  constructor(
    public readonly from: string,
    public readonly to: string,
    public weight: number | null,
    public readonly directed: boolean
  ) {}
}

export class Graph {
  // TODO: Does graph need to be modifiable? We replace it every time, so ..

  readonly vertices = new Map<string, Vertex>();
  readonly edges = new Map<string, Edge>();

  getEdges(): Edge[] {
    return [...this.edges.values()];
  }

  getVertices(): Vertex[] {
    return [...this.vertices.values()];
  }

  /** Adds a vertex. */
  addVertex(vertex: Vertex) {
    if (this.validateVertex(vertex)) throw new Error("Invalid vertex");
    this.vertices.set(vertex.id, vertex);
  }

  /** Adds an edge. */
  addEdge(edge: Edge) {
    if (!this.validateEdge(edge)) throw new Error("Invalid edge");

    this.edges.set(edge.id, edge);
    this.connectEdgeVertices(edge);
  }

  /** Checks if this edge can be inserted into current graph. */
  validateEdge(edge: Edge): boolean {
    return this.vertices.has(edge.from) && this.vertices.has(edge.to);
  }

  /** Checks if vertex is valid in this graph's context. */
  validateVertex(vertex: Vertex) {
    return this.vertices.has(vertex.id);
  }

  /** Adds the edge to vertices' out and in edges arrays. */
  private connectEdgeVertices(edge: Edge) {
    // TODO: Write this clener.

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fromNode = this.vertices.get(edge.from)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const toNode = this.vertices.get(edge.to)!;

    fromNode.outEdges.push(edge.id);
    toNode.inEdges.push(edge.id);

    if (!edge.directed) {
      fromNode.inEdges.push(edge.id);
      toNode.outEdges.push(edge.id);
    }
  }
}
