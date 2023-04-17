import { Instruction, AlgorithmFn } from "../instruction";
import { Graph, Vertex } from "../graph";

// TODO: Do something with those null assertions when doing distances.get()

const findClosest = (
  verticies: Set<Vertex>,
  distances: Map<Vertex, number>
): Vertex | undefined => {
  let closest: Vertex | undefined;

  for (const vertex of verticies) {
    if (!closest) {
      closest = vertex;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (distances.get(vertex)! < distances.get(closest)!) {
      closest = vertex;
    }
  }

  return closest;
};

export const dijkstra: AlgorithmFn = function (graph: Graph) {
  const instructions: Instruction[] = [];

  const unvisited = new Set(graph.vertices);
  const distances = new Map<Vertex, number>(
    graph.vertices.map((vertex) => [vertex, Infinity])
  );

  distances.set(graph.vertices[0], 0);

  instructions.push({
    description: "Set starting node's distance to 0.",
    highlights: [{ id: graph.vertices[0].id, color: "#0284c7" }],
  });

  while (unvisited.size > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const current = findClosest(unvisited, distances)!;
    unvisited.delete(current);

    instructions.push({
      description:
        "Find unvisited vertex with the smallest distance and mark it as visited.",
      highlights: [{ id: current.id, color: "#0284c7" }],
    });

    current.out.forEach((edge) => {
      distances.set(
        edge.b,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Math.min(distances.get(edge.b)!, distances.get(current)! + edge.weight)
      );
    });

    instructions.push({
      description: "Update minimum distance to all adjacent vertices.",
      highlights: [
        { id: current.id, color: "#0284c7" },
        ...current.out.map((edge) => ({
          id: edge.b.id,
          color: "#eab308",
        })),
      ],
    });
  }

  instructions.push({
    description: "All nodes were visited so we end the algorithm.",
    highlights: [],
  });

  return instructions;
};
