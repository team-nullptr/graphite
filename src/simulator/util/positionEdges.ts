import { Edge } from "../../engine/graph";

export type Edges<T> = [Edge, number][];

interface Group<T> {
  key: string;
  edges: Edge[];
}

export const positionEdges = <T>(edges: Edge[]): Edges<T> => {
  const groupedEdges = group(edges);
  let result: Edges<T> = [];

  for (const { key, edges } of groupedEdges.values()) {
    const sortedEdges = sort(edges, key);
    const positionedEdges = position(sortedEdges, key);
    result = [...result, ...positionedEdges];
  }

  return result;
};

const group = <T>(edges: Edge[]): Map<string, Group<T>> => {
  const grouped = new Map<string, Group<T>>();

  for (const edge of edges) {
    const key = [edge.a.id, edge.b.id].sort().join("");
    const group = grouped.get(key);

    if (group) {
      group.edges.push(edge);
    } else {
      const group = { key: edge.a.id, edges: [edge] };
      grouped.set(key, group);
    }
  }

  return grouped;
};

const sort = (edges: Edge[], key: string): Edge[] => {
  return edges.slice().sort((a, b) => {
    const firstDiscriminator = getEdgeDiscriminator(a, key);
    const secondDiscriminator = getEdgeDiscriminator(b, key);
    return firstDiscriminator - secondDiscriminator;
  });
};

const getEdgeDiscriminator = <T>(edge: Edge, key: string) => {
  if (!edge.directed) return 0;
  if (edge.a.id === key) return 1;
  return -1;
};

const position = <T>(edges: Edge[], key: string): Edges<T> => {
  return edges.map((edge, index) => {
    let position = index - (edges.length - 1) / 2;
    if (edge.a.id !== key) position *= -1;
    return [edge, position];
  });
};
