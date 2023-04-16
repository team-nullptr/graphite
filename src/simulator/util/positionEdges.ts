import { Edge } from "../../core/models/Graph";

export type Edges<T> = [Edge<T>, number][];

interface Group<T> {
  key: string;
  edges: Edge<T>[];
}

export const positionEdges = <T>(edges: Edge<T>[]): Edges<T> => {
  const groupedEdges = group(edges);
  const groups = [...groupedEdges.values()];

  let result: Edges<T> = [];

  for (const { key, edges } of groups) {
    const sortedEdges = sort(edges, key);
    const positionedEdges = position(sortedEdges, key);
    result = [...result, ...positionedEdges];
  }

  return result;
};

const group = <T>(edges: Edge<T>[]): Map<string, Group<T>> => {
  const grouped = new Map<string, Group<T>>();

  for (const edge of edges) {
    const key = [edge.a, edge.b].sort().join("");
    const group = grouped.get(key);

    if (group) {
      group.edges.push(edge);
    } else {
      const group = { key: edge.a, edges: [edge] };
      grouped.set(key, group);
    }
  }

  return grouped;
};

const sort = <T>(edges: Edge<T>[], key: string): Edge<T>[] => {
  return edges.slice().sort((a, b) => {
    const firstDiscriminator = getEdgeDiscriminator(a, key);
    const secondDiscriminator = getEdgeDiscriminator(b, key);
    return firstDiscriminator - secondDiscriminator;
  });
};

const getEdgeDiscriminator = <T>(edge: Edge<T>, key: string) => {
  if (!edge.directed) return 0;
  if (edge.a === key) return 1;
  return -1;
};

const position = <T>(edges: Edge<T>[], key: string): Edges<T> => {
  return edges.map((edge, index) => {
    let position = index - (edges.length - 1) / 2;
    if (edge.a !== key) position *= -1;
    return [edge, position];
  });
};
