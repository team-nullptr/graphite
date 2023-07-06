import { Graph, Vertex } from "../core/simulator/graph";
import { Instruction } from "../core/simulator/instruction";
import { Algorithm } from "../types/algorithm";

// TODO: This probably can be implemented neater. We should review this code later and make some optimisations.
// TODO: There is a lot of null assertions for now.
// TODO: Check if algorithm can be run on a graph.
// TODO: Is it possible to do some typescript magic to omit some of those non-null assertions?
// TODO: Do we want to use i18 to support multiple languages (en / pl)?

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

function* dijkstraInstructionGenerator(
  graph: Graph
): IterableIterator<Instruction> {
  // init instructions
  const permamentHighlights: [string, number][] = [];

  // init dijkstra
  const vertices = Object.values(graph.vertices);
  const distances = new Map(vertices.map((vertex) => [vertex.id, Infinity]));
  const unvisited = new Set(vertices);

  const start = vertices.at(0)!;
  distances.set(start.id, 0);

  yield {
    description: "Set distance to starting vertext to 0.",
    stepState: JSON.stringify([...distances.entries()]),
    highlights: new Map([[start.id, 270]]),
  };

  while (unvisited.size > 0) {
    const current = pickClosest(unvisited.values(), distances)!;

    yield {
      description: "Pick the closest vertex from all unvisited vertices.",
      stepState: JSON.stringify([...distances.entries()]),
      highlights: new Map([...permamentHighlights, [current.id, 90]]),
    };

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];
      const adj = graph.vertices[edge.to];

      distances.set(
        adj.id,
        Math.min(
          distances.get(adj.id)!,
          distances.get(current.id)! + edge.weight!
        )
      );
    }

    const currentOutsHighlight = current.outs.map((edgeId) => {
      const edge = graph.edges[edgeId];
      const adj = graph.vertices[edge.to];
      return [adj.id, 180] as [string, number];
    });

    yield {
      description:
        "Iterate over all adjacent unvisited nodes and update their min length.",
      stepState: JSON.stringify([...distances.entries()]),
      highlights: new Map([...permamentHighlights, ...currentOutsHighlight]),
    };

    yield {
      description: "Mark current node as visited.",
      stepState: JSON.stringify([...distances.entries()]),
      highlights: new Map([...permamentHighlights, [current.id, 0]]),
    };

    permamentHighlights.push([current.id, 225]);
    unvisited.delete(current);
  }

  yield {
    description: "There is no more unvisited vertices, end the algorithm!",
    stepState: JSON.stringify([...distances.entries()]),
    highlights: new Map([...permamentHighlights]),
  };
}

const dijkstraInstructionResolver = (graph: Graph) => [
  ...dijkstraInstructionGenerator(graph),
];

export const dijkstraAlgorithm: Algorithm = {
  name: "Dijkstra",
  description:
    "Dijkstra algorithm allows you to find shortest path from starting node to every other node.",
  tags: ["shortest path"],
  instructionsResolver: dijkstraInstructionResolver,
};
