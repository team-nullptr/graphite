/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { Algorithm } from "~/core/simulator/algorithm";
import { Graph, Vertex } from "~/core/simulator/graph";
import { VertexPreview } from "~/shared/ui/VertexPreview";
import type { Color } from "~/types/color";
import type { Highlights } from "../highlight";
import { StepBuilder, type Step } from "../step";
import { State, TableStateBuilder } from "../state";

type TableData = {
  vertex: {
    id: string;
    color?: Color;
  };
  distance: number;
};

const columnHelper = createColumnHelper<TableData>();

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
      return <span className="block transition-all">{info.getValue()}</span>;
    },
  }),
] as ColumnDef<unknown, any>[];

function buildTableData(distances: Map<string, number>, highlights: Highlights) {
  return [...distances.entries()].map(
    ([id, distance]): TableData => ({
      vertex: {
        id,
        color: highlights.get(id),
      },
      distance,
    })
  );
}

function buildDefaultState(distances: Map<string, number>, highlights: Highlights): State[] {
  return [new TableStateBuilder({ columns }).data(buildTableData(distances, highlights)).build()];
}

function visitedHighlights(vertices: Vertex[], unvisited: Set<Vertex>): Highlights {
  return new Map(
    vertices.filter((vertex) => !unvisited.has(vertex)).map((vertex) => [vertex.id, "slate"])
  );
}

function pickClosest(
  unvisited: IterableIterator<Vertex>,
  distances: Map<string, number>
): Vertex | undefined {
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
}

function algorithm(graph: Graph, startingVertex: string): Step[] {
  const steps: Step[] = [];

  const vertices = Object.values(graph.vertices);
  const distances = new Map(vertices.map((vertex) => [vertex.id, Infinity]));
  const unvisited = new Set(vertices);

  const start = graph.vertices[startingVertex];
  distances.set(start.id, 0);

  {
    const highlights: Highlights = new Map([[start.id, "sky"]]);

    steps.push(
      new StepBuilder({
        description: "Set distance to starting vertex to 0.",
      })
        .state(buildDefaultState(distances, highlights))
        .verticesHighlights(highlights)
        .build()
    );
  }

  while (unvisited.size > 0) {
    const current = pickClosest(unvisited.values(), distances)!;

    {
      const highlights: Highlights = new Map([
        [current.id, "sky"],
        ...visitedHighlights(vertices, unvisited),
      ]);

      steps.push(
        new StepBuilder({
          description: "Pick the closest vertex from all unvisited vertices.",
        })
          .state(buildDefaultState(distances, highlights))
          .verticesHighlights(highlights)
          .build()
      );
    }

    const outsHighlights: Highlights = new Map();

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];

      const adjacent =
        graph.vertices[edge.to === current.id && !edge.directed ? edge.from : edge.to];

      if (!unvisited.has(adjacent)) {
        continue;
      }

      distances.set(
        adjacent.id,
        Math.min(distances.get(adjacent.id)!, distances.get(current.id)! + edge.weight!)
      );

      outsHighlights.set(adjacent.id, "sky");
    }

    {
      const highlights: Highlights = new Map([
        [current.id, "orange"],
        ...outsHighlights,
        ...visitedHighlights(vertices, unvisited),
      ]);

      steps.push(
        new StepBuilder({
          description: "Iterate over all adjacent unvisited nodes and update their min length.",
        })
          .state(buildDefaultState(distances, highlights))
          .verticesHighlights(highlights)
          .build()
      );
    }

    unvisited.delete(current);

    {
      const highlights = visitedHighlights(vertices, unvisited);

      steps.push(
        new StepBuilder({
          description: "Mark current node as visited.",
        })
          .state(buildDefaultState(distances, highlights))
          .verticesHighlights(highlights)
          .build()
      );
    }
  }

  {
    const highlights = visitedHighlights(vertices, unvisited);

    steps.push(
      new StepBuilder({
        description: "There is no more unvisited vertices. End the algorithm.",
      })
        .state(buildDefaultState(distances, highlights))
        .verticesHighlights(highlights)
        .build()
    );
  }

  return steps;
}

export interface DijkstraAlgorithmParams {
  "Start Vertex": string;
}

export const dijkstra: Algorithm<DijkstraAlgorithmParams> = {
  name: "Dijkstra",
  description: "Find the shortest path from a starting node to every other node.",
  tags: ["shortest path"],
  params: {
    "Start Vertex": { type: "vertex", required: true },
  },
  stepGenerator: (graph, params) => {
    return algorithm(graph, params["Start Vertex"]);
  },
};
