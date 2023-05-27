import { Graph, Vertex } from "../engine/runner/graph";
import { Algorithm } from "../models/algorithm";

// TODO: There is a lot of null assertions for now.
// Of course in the future we need to check if algorithm can be run on current graph.
// TODO: Is it possible to do some typescript magic to omit some of those non-null assertions?

const pickClosest = (
  unvisited: IterableIterator<Vertex>,
  distances: Map<string, number>
): Vertex | undefined => {
  let next: Vertex | undefined;

  for (const candidate of unvisited) {
    if (!next) {
      next = candidate;
      continue;
    }

    if (distances.get(next.id)! > distances.get(candidate.id)!) {
      next = candidate;
    }
  }

  return next;
};

const dijkstraImpl = (graph: Graph): string[] => {
  const instructions: string[] = [];
  const unvisited = new Set(graph.vertices);
  const distances = new Map(graph.edges.map((edge) => [edge.id, Infinity]));

  distances.set(graph.vertices.at(0)!.id, 0);
  instructions.push("Set distance to starting vertext to 0.");

  while (true) {
    instructions.push("Pick the closest vertex from all unvisited vertices.");
    const current = pickClosest(unvisited.values(), distances);

    if (!current) {
      instructions.push(
        "There is no more unvisited vertices, end the algorithm!"
      );
      break;
    }

    instructions.push(
      "Iterate over all adjacent unvisited nodes and update their min length."
    );

    for (const edgeId of current.outEdges) {
      const edge = graph.edges.find((edge) => edge.id === edgeId)!;
      const adj = graph.vertices.find((vertex) => vertex.id === edge.to)!;

      if (!unvisited.has(adj)) {
        continue;
      }

      distances.set(
        adj.id,
        Math.min(
          distances.get(adj.id)!,
          distances.get(current.id)! + edge.weight!
        )
      );
    }

    instructions.push("Mark current node as visited.");
    unvisited.delete(current);
  }

  return instructions;
};

export const dijkstra: Algorithm = {
  name: "Dijkstra",
  impl: dijkstraImpl,
} as const;
