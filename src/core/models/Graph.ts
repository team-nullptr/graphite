export interface Vertex<T> {
  readonly id: string;
  value: T;
}

export interface Edge<T = undefined> {
  readonly id: string;
  value?: T;
  directed?: boolean;
  a: string;
  b: string;
}

export interface Graph<V, E = undefined> {
  vertices: Vertex<V>[];
  edges: Edge<E>[];
}
