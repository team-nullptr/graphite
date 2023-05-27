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

export type Graph = {
  readonly edges: Edge[];
  readonly vertices: Vertex[];
};

// export class Graph {
//   // TODO: Does graph need to be modifiable? We replace it every time, so .. Maybe for tests?

//   readonly vertices = new Map<string, Vertex>();
//   readonly edges = new Map<string, Edge>();

//   constructor(vertices: Vertex[] = [], edges: Edge[] = []) {
//     // TODO: This is a temporary 'hack' there for sure is a cleaner way to do this.
//     vertices.forEach((it) => this.addVertex(it));
//     edges.forEach((it) => this.addEdge(it));
//   }

//   getEdges(): Edge[] {
//     return [...this.edges.values()];
//   }

//   getVertices(): Vertex[] {
//     return [...this.vertices.values()];
//   }

//   addVertex(vertex: Vertex): void {
//     if (this.validateVertex(vertex)) throw new Error("Invalid vertex");
//     this.vertices.set(vertex.id, vertex);
//   }

//   addEdge(edge: Edge): void {
//     if (!this.validateEdge(edge)) throw new Error("Invalid edge");

//     this.edges.set(edge.id, edge);
//     this.connectEdgeVertices(edge);
//   }

//   validateEdge(edge: Edge): boolean {
//     return this.vertices.has(edge.from) && this.vertices.has(edge.to);
//   }

//   validateVertex(vertex: Vertex) {
//     return this.vertices.has(vertex.id);
//   }

//   private connectEdgeVertices(edge: Edge) {
//     // TODO: Write this clener.

//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const fromNode = this.vertices.get(edge.from)!;
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const toNode = this.vertices.get(edge.to)!;

//     fromNode.outEdges.push(edge.id);
//     toNode.inEdges.push(edge.id);

//     if (!edge.directed) {
//       fromNode.inEdges.push(edge.id);
//       toNode.outEdges.push(edge.id);
//     }
//   }
// }
