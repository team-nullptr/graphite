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
    public weight: number | null,
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
  addEdge(
    from: string,
    to: string,
    weight: number | null,
    directed = false
  ): Edge {
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
