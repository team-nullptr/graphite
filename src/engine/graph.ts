export type Vertex = {
  id: string;
  value: number;
  out: Edge[];
  in: Edge[];
};

export type Edge = {
  id: string;
  weight: number;
  a: Vertex;
  b: Vertex;
  directed: boolean;
};

export class Graph {
  private __vertices: Vertex[] = [];
  private __edges: Edge[] = [];

  get vertices(): Vertex[] {
    return this.__vertices;
  }

  get edges(): Edge[] {
    return this.__edges;
  }

  addVertex(value: number) {
    const vertex = {
      id: `v-${this.__vertices.length}`,
      in: [],
      out: [],
      value,
    };

    this.__vertices.push(vertex);

    return vertex;
  }

  addDirectedEdge(a: Vertex, b: Vertex, weight: number): Edge {
    const edge: Edge = {
      id: `e-${this.__edges.length}`,
      a,
      b,
      weight,
      directed: true,
    };

    a.out.push(edge);
    b.in.push(edge);
    this.__edges.push(edge);

    return edge;
  }

  addUndirectedEdge(a: Vertex, b: Vertex, weight: number): Edge {
    const edge: Edge = {
      id: `e-${this.__edges.length}`,
      a,
      b,
      weight,
      directed: false,
    };

    a.out.push(edge);
    a.in.push(edge);
    b.out.push(edge);
    b.in.push(edge);
    this.__edges.push(edge);

    return edge;
  }
}
