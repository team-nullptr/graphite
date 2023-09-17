/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import type { Algorithm } from "~/core/simulator/algorithm";
import { Graph, Vertex } from "~/core/simulator/graph";
import { VertexPreview } from "~/shared/ui/VertexPreview";
import type { Color } from "~/types/color";
import type { Highlight, Highlights } from "../highlight";
import { StepBuilder, type Step } from "../step";
import { State, TableStateBuilder } from "../state";

/** TableData represents data shown in the dijkstra's table state. */
type TableData = {
  vertex: {
    id: string;
    color?: Color;
  };
  distance: number;
};

const columnHelper = createColumnHelper<TableData>();

/** Dijkstra table step columns. */
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

/** Helper for building table data from given algorithm state. */
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

/** Builds base state for step. */
function buildBaseState(distances: Map<string, number>, highlights: Highlights): State[] {
  return [new TableStateBuilder({ columns }).data(buildTableData(distances, highlights)).build()];
}

/** Generates highlights for visited vertices. */
function visitedHighlights(vertices: Vertex[], unvisited: Set<Vertex>): Highlights {
  return new Map(
    vertices.filter((vertex) => !unvisited.has(vertex)).map((vertex) => [vertex.id, "slate"])
  );
}

/** Get details (vertices, edges) about path which leads to shortest distance for a target vertex. */
function resolvePath(
  target: string,
  parents: Map<string, string | undefined>,
  graph: Graph
): { vertices: string[]; edges: string[] } {
  const vertices: string[] = [target];
  const edges: string[] = [];

  let next = parents.get(target);

  while (next) {
    const from = vertices[vertices.length - 1];
    vertices.push(next);
    const to = vertices[vertices.length - 1];

    const edge = Object.values(graph.edges).find((edge) => edge.between(from, to));
    edges.push(edge!.id);

    next = parents.get(next);
  }

  return { vertices, edges };
}

/** Dijkstra algorithm helper for picking the next closest vertex. */
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

/** Dijkstra algorithm implementation. */
function algorithm(graph: Graph, startingVertex: string, destinationVertex?: string): Step[] {
  const steps: Step[] = [];

  const vertices = Object.values(graph.vertices);
  const unvisited = new Set(vertices);

  const distances = new Map(vertices.map((vertex) => [vertex.id, Infinity]));
  const parents = new Map<string, string | undefined>();

  const start = graph.vertices[startingVertex];
  distances.set(start.id, 0);
  parents.set(start.id, undefined);

  {
    const highlights: Highlights = new Map([[start.id, "sky"]]);

    steps.push(
      new StepBuilder({
        description: "Set distance to starting vertex to 0.",
      })
        .state(buildBaseState(distances, highlights))
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
          .state(buildBaseState(distances, highlights))
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

      if (distances.get(adjacent.id)! > distances.get(current.id)! + edge.weight!) {
        distances.set(adjacent.id, distances.get(current.id)! + edge.weight!);
        parents.set(adjacent.id, current.id);
      }

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
          .state(buildBaseState(distances, highlights))
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
          .state(buildBaseState(distances, highlights))
          .verticesHighlights(highlights)
          .build()
      );
    }
  }

  {
    let highlights = visitedHighlights(vertices, unvisited);

    const step = new StepBuilder({
      description: "There is no more unvisited vertices. End the algorithm.",
    }).state(buildBaseState(distances, highlights));

    if (destinationVertex) {
      const { vertices, edges } = resolvePath(destinationVertex, parents, graph);

      step.edgesHighlights(new Map(edges.map((edgeId) => [edgeId, "sky"])));
      highlights = new Map([
        ...highlights,
        ...vertices.map((vertexId) => [vertexId, "sky"] as Highlight),
      ]);
    }

    steps.push(step.verticesHighlights(highlights).build());
  }

  return steps;
}

export interface DijkstraAlgorithmParams {
  "Start Vertex": string;
  "Destination Vertex": string;
}

export const dijkstra: Algorithm<DijkstraAlgorithmParams> = {
  name: "Shortest path with Dijkstra",
  description: "Finds the shortest path from a starting node to every other node.",
  tags: ["shortest path"],
  guide: `
  Dijkstra algorithm finds the shortest path between vertices in a graph. We use a map to keep track of shortest distance from **Start Vertex** to other vertices. By default distance to all vertices is equal to *infinity*. We also keep track of unvisited vertices with a set.

  Before the "algorithm loop" we set **Start Vertex's** distance to 0. Then until unvisited set is not empty:

  1. We pick the vertex with the smallest distance
  2. Iterate through it's adjacent vertices
      - If adjacent vertex was already visited we continue to the next adjacent vertex. 
      - Otherwise we update the minimum distance to the adjacent vertex if it's current minimum distance is bigger than currently processed vertex's minimum distance + connection edge weight.
  3. After we have processed all adjacent vertices we remove the currently processed vertex from unvisited vertices.
  `,
  params: {
    "Start Vertex": { type: "vertex", required: true },
    "Destination Vertex": { type: "vertex", required: false },
  },
  stepGenerator: (graph, params) => {
    return algorithm(graph, params["Start Vertex"], params["Destination Vertex"]);
  },
};
