export interface Vertex<T> {
  readonly id: string;
  value: T;
}

export interface Edge {
  readonly id: string;
  value?: number;
  a: string;
  b: string;
}

export interface Graph<T> {
  vertices: Vertex<T>[];
  edges: Edge[];
}
