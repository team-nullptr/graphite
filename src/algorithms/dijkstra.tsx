/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createColumnHelper } from "@tanstack/react-table";
import { Graph, Vertex } from "~/core/simulator/graph";
import {
  Highlights,
  Step,
  TableState,
  Algorithm,
} from "~/core/simulator/algorithm";
import { VertexPreview } from "~/shared/ui/VertexPreview";
import type { Color } from "~/types/color";

// TODO: Check if algorithm can be run on a graph.
// TODO: Do we want to use i18 to support multiple languages (en / pl)?

export type DijkstraTableData = {
  vertex: {
    id: string;
    color?: Color;
  };
  distance: {
    value: number;
    justUpdated: boolean;
  };
};

const columnHelper = createColumnHelper<DijkstraTableData>();

const columns = [
  columnHelper.accessor("vertex", {
    header: "Vertex",
    cell: (info) => {
      const { id, color } = info.getValue();
      return <VertexPreview color={color} label={id} />;
    },
  }),
  columnHelper.accessor("distance", {
    header: "Distance",
    cell: (info) => {
      const { value, justUpdated } = info.getValue();
      return (
        <span
          className={`block transition-all ${
            justUpdated && "animate-pulse text-sky-500"
          }`}
        >
          {value}
        </span>
      );
    },
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

const algorithm = (graph: Graph, startingVertex: string): Step[] => {
  const steps: Step[] = [];
  const savedHighlights: [string, Color][] = [];

  const vertices = Object.values(graph.vertices);
  const distances = new Map(vertices.map((vertex) => [vertex.id, Infinity]));
  const unvisited = new Set(vertices);

  const start = graph.vertices[startingVertex];
  distances.set(start.id, 0);

  {
    const highlights: Highlights = new Map([[start.id, "sky"]]);

    steps.push({
      description: "Set distance to starting vertext to 0.",
      state: {
        type: "table",
        columns,
        data: [...distances.entries()].map(
          ([id, distance]): DijkstraTableData => ({
            vertex: {
              id,
              color: highlights.get(id),
            },
            distance: {
              value: distance,
              justUpdated: id === start.id,
            },
          })
        ),
      },
      highlights,
    });
  }

  while (unvisited.size > 0) {
    const current = pickClosest(unvisited.values(), distances)!;

    {
      const highlights: Highlights = new Map([
        ...savedHighlights,
        [current.id, "sky"],
      ]);

      steps.push({
        description: "Pick the closest vertex from all unvisited vertices.",
        state: {
          type: "table",
          columns,
          data: [...distances.entries()].map(
            ([id, distance]): DijkstraTableData => ({
              vertex: {
                id,
                color: highlights.get(id),
              },
              distance: {
                value: distance,
                justUpdated: false,
              },
            })
          ),
        },
        highlights,
      });
    }

    const outsHighlights: Highlights = new Map();

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

      outsHighlights.set(adjacent.id, "sky");
    }

    {
      const highlights: Highlights = new Map([
        ...savedHighlights,
        ...outsHighlights,
        [current.id, "orange"],
      ]);

      steps.push({
        description:
          "Iterate over all adjacent unvisited nodes and update their min length.",
        state: {
          type: "table",
          columns,
          data: [...distances.entries()].map(
            ([id, distance]): DijkstraTableData => ({
              vertex: {
                id,
                color: highlights.get(id),
              },
              distance: {
                value: distance,
                justUpdated: outsHighlights.has(id),
              },
            })
          ),
        },
        highlights,
      });
    }

    savedHighlights.push([current.id, "slate"]);
    unvisited.delete(current);

    {
      const highlights: Highlights = new Map([...savedHighlights]);

      steps.push({
        description: "Mark current node as visited.",
        state: {
          type: "table",
          columns,
          data: [...distances.entries()].map(
            ([id, distance]): DijkstraTableData => ({
              vertex: {
                id,
                color: highlights.get(id),
              },
              distance: {
                value: distance,
                justUpdated: false,
              },
            })
          ),
        },
        highlights,
      });
    }
  }

  {
    const highlights: Highlights = new Map([...savedHighlights]);

    steps.push({
      description: "There is no more unvisited vertices, end the algorithm!",
      state: {
        type: "table",
        columns,
        data: [...distances.entries()].map(
          ([id, distance]): DijkstraTableData => ({
            vertex: {
              id,
              color: highlights.get(id),
            },
            distance: {
              value: distance,
              justUpdated: false,
            },
          })
        ),
      },
      highlights: new Map([...savedHighlights]),
    });
  }

  return steps;
};

export const dijkstra: Algorithm = {
  name: "Dijkstra",
  description:
    "Dijkstra algorithm allows you to find shortest path from starting node to every other node.",
  tags: ["shortest path"],
  algorithm,
};
