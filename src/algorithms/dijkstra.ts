import { Graph, Vertex } from "../engine/runner/graph";
import { Instruction } from "../engine/runner/instruction";
import { Algorithm } from "../models/algorithm";

// TODO: This probably can be implemented neater. We should review this code later and make some optimisations.
// TODO: There is a lot of null assertions for now.
// TODO: Check if algorithm can be run on a graph.
// TODO: Is it possible to do some typescript magic to omit some of those non-null assertions?
// TODO: Do we want to use i18 to support multiple languages (en / pl)?

const highlightAll = (vertices: Vertex[], hue: number) =>
  vertices.map((vertex) => [vertex.id, hue] as [string, number]);

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

const dijkstraImpl = (graph: Graph): Instruction[] => {
  const instructions: Instruction[] = [];
  const vertices = Object.values(graph.vertices);
  const edges = Object.values(graph.edges);

  const distances = new Map(edges.map((edge) => [edge.id, Infinity]));
  const unvisited = new Set(vertices);
  const visited: Vertex[] = [];

  const start = vertices.at(0);

  if (!start) {
    console.error("Could not get start node");
    return [];
  }

  distances.set(start.id, 0);

  instructions.push({
    description: "Set distance to starting vertext to 0.",
    highlights: new Map([[start.id, 270]]),
  });

  while (true) {
    const visitedHighlights = highlightAll(visited, 225);
    const current = pickClosest(unvisited.values(), distances);

    if (!current) {
      instructions.push({
        description: "There is no more unvisited vertices, end the algorithm!",
        highlights: new Map([...visitedHighlights]),
      });
      break;
    }

    instructions.push({
      description: "Pick the closest vertex from all unvisited vertices.",
      highlights: new Map([[current.id, 90], ...visitedHighlights]),
    });

    instructions.push({
      description:
        "Iterate over all adjacent unvisited nodes and update their min length.",
      highlights: current.outs.reduce((highlights, edgeId) => {
        const edge = graph.edges[edgeId];
        const adj = graph.vertices[edge.to];
        return highlights.set(adj.id, 180);
      }, new Map([...visitedHighlights])),
    });

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];
      const adj = graph.vertices[edge.to];

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

    instructions.push({
      description: "Mark current node as visited.",
      highlights: new Map([[current.id, 0], ...visitedHighlights]),
    });

    visited.push(current);
    unvisited.delete(current);
  }

  return instructions;
};

export const dijkstra: Algorithm = {
  name: "Dijkstra",
  impl: dijkstraImpl,
} as const;
