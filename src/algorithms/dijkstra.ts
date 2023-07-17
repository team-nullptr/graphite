/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createColumnHelper } from "@tanstack/react-table";
import { Graph, Vertex } from "~/core/simulator/graph";
import { Step } from "~/core/simulator/step";
import { Algorithm } from "~/types/algorithm";
import type { Color } from "~/types/color";

// TODO: Check if algorithm can be run on a graph.
// TODO: Do we want to use i18 to support multiple languages (en / pl)?

type DijkstraStepState = {
  vertex: string;
  distance: number;
};

const columnHelper = createColumnHelper<DijkstraStepState>();

const columns = [
  columnHelper.accessor("vertex", {
    header: "Vertex",
  }),
  columnHelper.accessor("distance", {
    header: "Distance",
  }),
];

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

const algorithm = (
  graph: Graph,
  startingVertex: string
): Step<DijkstraStepState>[] => {
  const steps: Step<DijkstraStepState>[] = [];
  const highlights: [string, Color][] = [];

  const vertices = Object.values(graph.vertices);
  const distances = new Map(vertices.map((vertex) => [vertex.id, Infinity]));
  const unvisited = new Set(vertices);

  const start = graph.vertices[startingVertex];
  distances.set(start.id, 0);

  steps.push({
    description: "Set distance to starting vertext to 0.",
    state: {
      columns,
      data: [...distances.entries()].map(([vertex, distance]) => ({
        vertex,
        distance,
      })),
    },
    highlights: new Map([[start.id, "sky"]]),
  });

  while (unvisited.size > 0) {
    const current = pickClosest(unvisited.values(), distances)!;

    steps.push({
      description: "Pick the closest vertex from all unvisited vertices.",
      state: {
        columns,
        data: [...distances.entries()].map(([vertex, distance]) => ({
          vertex,
          distance,
        })),
      },
      highlights: new Map([...highlights, [current.id, "sky"]]),
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
      state: {
        columns,
        data: [...distances.entries()].map(([vertex, distance]) => ({
          vertex,
          distance,
        })),
      },
      highlights: new Map([
        ...highlights,
        ...outsHighlights,
        [current.id, "orange"],
      ]),
    });

    highlights.push([current.id, "slate"]);
    unvisited.delete(current);

    steps.push({
      description: "Mark current node as visited.",
      state: {
        columns,
        data: [...distances.entries()].map(([vertex, distance]) => ({
          vertex,
          distance,
        })),
      },
      highlights: new Map([...highlights]),
    });
  }

  steps.push({
    description: "There is no more unvisited vertices, end the algorithm!",
    state: {
      columns,
      data: [...distances.entries()].map(([vertex, distance]) => ({
        vertex,
        distance,
      })),
    },
    highlights: new Map([...highlights]),
  });

  return steps;
};

export const dijkstra: Algorithm<DijkstraStepState> = {
  name: "Dijkstra",
  description:
    "Dijkstra algorithm allows you to find shortest path from starting node to every other node.",
  tags: ["shortest path"],
  algorithm,
};
