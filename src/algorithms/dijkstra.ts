/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Graph, Vertex } from "~/core/simulator/graph";
import { Step } from "~/core/simulator/step";
import { Algorithm } from "~/types/algorithm";
import type { Color } from "~/types/color";

// TODO: Check if algorithm can be run on a graph.
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

const algorithm = (graph: Graph, startingVertex: string): Step[] => {
  const steps: Step[] = [];
  const highlights: [string, Color][] = [];

  const vertices = Object.values(graph.vertices);
  const distances = new Map(vertices.map((vertex) => [vertex.id, Infinity]));
  const unvisited = new Set(vertices);

  const start = graph.vertices[startingVertex];
  distances.set(start.id, 0);

  steps.push({
    description: "Set distance to starting vertext to 0.",
    stepState: JSON.stringify([...distances.entries()]),
    highlights: new Map([[start.id, "sky"]]),
  });

  while (unvisited.size > 0) {
    const current = pickClosest(unvisited.values(), distances)!;

    steps.push({
      description: "Pick the closest vertex from all unvisited vertices.",
      stepState: JSON.stringify([...distances.entries()]),
      highlights: new Map([...highlights, [current.id, "purple"]]),
    });

    const outsHighlights: [string, Color][] = [];

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];

      const adjacent =
        graph.vertices[
          edge.to === current.id && !edge.directed ? edge.from : edge.to
        ];

      if (!unvisited.has(adjacent)) {
        continue;
      }

      distances.set(
        adjacent.id,
        Math.min(
          distances.get(adjacent.id)!,
          distances.get(current.id)! + edge.weight!
        )
      );

      outsHighlights.push([adjacent.id, "sky"]);
    }

    steps.push({
      description:
        "Iterate over all adjacent unvisited nodes and update their min length.",
      stepState: JSON.stringify([...distances.entries()]),
      highlights: new Map([
        ...highlights,
        ...outsHighlights,
        [current.id, "purple"],
      ]),
    });

    highlights.push([current.id, "slate"]);
    unvisited.delete(current);

    steps.push({
      description: "Mark current node as visited.",
      stepState: JSON.stringify([...distances.entries()]),
      highlights: new Map([...highlights]),
    });
  }

  steps.push({
    description: "There is no more unvisited vertices, end the algorithm!",
    stepState: JSON.stringify([...distances.entries()]),
    highlights: new Map([...highlights]),
  });

  return steps;
};

export const dijkstra: Algorithm = {
  name: "Dijkstra",
  description:
    "Dijkstra algorithm allows you to find shortest path from starting node to every other node.",
  tags: ["shortest path"],
  algorithm,
};
