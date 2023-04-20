export type Vertex = {
  id: string;
  value: number;
  in: Edge[];
  out: Edge[];
};

export type Edge = {
  id: string;
  weight: number;
  a: Vertex;
  b: Vertex;
  directed: boolean;
};

export class Graph {
  readonly vertices: Vertex[] = [];
  readonly edges: Edge[] = [];

  addVertex(value: number) {
    const id = `v-${this.vertices.length}`;
    const vertex: Vertex = { id, in: [], out: [], value };
    this.vertices.push(vertex);
    return vertex;
  }

  addEdge(a: Vertex, b: Vertex, weight: number, directed: boolean): Edge {
    const id = `e-${this.edges.length}`;
    const edge: Edge = { id, a, b, weight, directed };
    this.connectEdge(edge, a, b);
    this.connectEdge(edge, b, a);
    this.edges.push(edge);
    return edge;
  }

  private connectEdge(edge: Edge, from: Vertex, to: Vertex): void {
    from.out.push(edge);
    to.in.push(edge);
  }
}
