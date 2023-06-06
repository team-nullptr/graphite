import { Edge } from "../../../engine/runner/graph";

export type Connection = [vertex: string, edge: Edge[]];

/**
 * Groups edges by vertexes they connect
 * @param edges An array of edges to be grouped
 * @returns A map of grouped edges with the key being the connection name
 */
export const groupEdges = (edges: Edge[]): Connection[] => {
  const connections = new Map<string, Connection>();

  for (const edge of edges) {
    const connectionKey = [edge.from, edge.to].sort().join("");
    const connection = connections.get(connectionKey);

    if (connection) {
      connection[1].push(edge);
      continue;
    } else {
      const vertexKey = edge.from;
      const group: Connection = [vertexKey, [edge]];
      connections.set(connectionKey, group);
    }
  }

  return [...connections.values()];
};

export type PositionedEdge = [edge: Edge, position: number];

/**
 * Assigns positions to edges within the given group to prevent overlapping
 * @param group An array of edges to have a position assigned
 * @param vertex An identifier of the beginning vertex
 * @returns An array of edges with assigned positions
 */
export const distributeEdges = (
  group: Edge[],
  vertex: string
): PositionedEdge[] => {
  return group.map((edge, index) => {
    // const circular = edge.a.id === edge.b.id;
    const position = false ? index : index - (group.length - 1) / 2;
    // Edges starting on the opposite vertex need their position to be reversed
    // otherwise they will bend in the wrong direction
    const reverse = edge.from !== vertex;
    return [edge, reverse ? -position : position];
  });
};

/**
 * Sorts edges by their direction relative to the beginning vertex
 * @param edges An array of edges to be sorted
 * @param vertex An identifier of the beginning vertex
 * @returns Edges sorted by their direction
 */
export const sortEdges = (edges: Edge[], vertex: string): Edge[] => {
  return edges.slice().sort((a, b) => {
    const firstDiscriminator = getEdgeDiscriminator(a, vertex);
    const secondDiscriminator = getEdgeDiscriminator(b, vertex);
    return firstDiscriminator - secondDiscriminator;
  });
};

/**
 * Returns a discriminator used to sort edges by their direction relative to the beginning vertex
 * @param edge
 * @param key An identifier of the beginning vertex of a group of edges (only use for sorting multiple edges!)
 * @returns The edge discriminator
 */
const getEdgeDiscriminator = (edge: Edge, key: string) => {
  if (!edge.directed) return 0;
  if (edge.from === key) return 1;
  return -1;
};
