/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { Algorithm } from "~/core/simulator/algorithm";
import { Graph, Vertex } from "~/core/simulator/graph";
import { VertexPreview } from "~/shared/ui/VertexPreview";
import type { Color } from "~/types/color";
import type { Highlight, Highlights } from "../highlight";
import { StepBuilder, type Step } from "../step";
import { State, TableStateBuilder } from "../state";
import { Heap, minHeapCompareFn } from "../datastructures/heap";

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
] as Array<ColumnDef<unknown, any>>;

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
function buildBaseState(distances: Map<string, number>, highlights: Highlights): Array<State> {
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
): { vertices: Array<string>; edges: Array<string> } {
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

/** Dijkstra algorithm implementation. */
function algorithm(graph: Graph, startingVertex: string, destinationVertex?: string): Array<Step> {
  const steps: Step[] = [];

  const vertices = Object.values(graph.vertices);
  const unvisited = new Set(vertices);

  const parents = new Map<string, string | undefined>([[startingVertex, undefined]]);
  const initialDistances: Array<[nodeId: string, distance: number]> = vertices.map((vertex) => [
    vertex.id,
    startingVertex === vertex.id ? 0 : Infinity,
  ]);

  const distancesMap = new Map(initialDistances);
  const distancesPq = new Heap<string>(initialDistances, minHeapCompareFn);

  {
    const highlights: Highlights = new Map([[startingVertex, "sky"]]);

    steps.push(
      new StepBuilder({
        description: "Set distance to starting vertex to 0.",
      })
        .state(buildBaseState(distancesMap, highlights))
        .verticesHighlights(highlights)
        .build()
    );
  }

  while (distancesPq.size > 0) {
    const [currentId, currentDistance] = distancesPq.extractTop();
    const current = graph.vertices[currentId];

    {
      const highlights: Highlights = new Map([
        [current.id, "sky"],
        ...visitedHighlights(vertices, unvisited),
      ]);

      steps.push(
        new StepBuilder({
          description: "Pick the closest vertex from all unvisited vertices.",
        })
          .state(buildBaseState(distancesMap, highlights))
          .verticesHighlights(highlights)
          .build()
      );
    }

    const outsHighlights: Highlights = new Map();

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];
      const adjacent =
        graph.vertices[edge.to === current.id && !edge.directed ? edge.from : edge.to];

      const newDistance = currentDistance + edge.weight!;

      if (distancesMap.get(adjacent.id)! > newDistance) {
        distancesPq.increaseKey(adjacent.id, newDistance);
        distancesMap.set(adjacent.id, newDistance);
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

      console.log(distancesMap);

      steps.push(
        new StepBuilder({
          description:
            "Iterate over all adjacent unvisited nodes and update their minimum distance.",
        })
          .state(buildBaseState(distancesMap, highlights))
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
          .state(buildBaseState(distancesMap, highlights))
          .verticesHighlights(highlights)
          .build()
      );
    }
  }

  {
    let highlights = visitedHighlights(vertices, unvisited);

    const step = new StepBuilder({
      description: "There is no more unvisited vertices. End the algorithm.",
    }).state(buildBaseState(distancesMap, highlights));

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
  **Dijkstra** algorithm finds the shortest path between vertices in a graph. There is no a single way of
  implementing Dijkstra algorithm, hovewer we often use priority queue to optimize finding the next vertex
  with the smallest distance.

  \`\`\`
  1   function Dijkstra(Graph, source):
  2       create vertex priority queue Q
  3
  4       dist[source] ← 0                          // Initialization
  5       Q.add_with_priority(source, 0)            // associated priority equals dist[·]
  6
  7       for each vertex v in Graph.Vertices:
  8           if v ≠ source
  9               prev[v] ← UNDEFINED               // Predecessor of v
  10              dist[v] ← INFINITY                // Unknown distance from source to v
  11              Q.add_with_priority(v, INFINITY)
  12
  13
  14      while Q is not empty:                     // The main loop
  15          u ← Q.extract_min()                   // Remove and return best vertex
  16          for each neighbor v of u:             // Go through all v neighbors of u
  17              alt ← dist[u] + Graph.Edges(u, v)
  18              if alt < dist[v]:
  19                  prev[v] ← u
  20                  dist[v] ← alt
  21                  Q.decrease_priority(v, alt)
  22
  23      return dist, prev
  \`\`\`
  source: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
  `,
  params: {
    "Start Vertex": { type: "vertex", required: true },
    "Destination Vertex": { type: "vertex", required: false },
  },
  stepGenerator: (graph, params) =>
    algorithm(graph, params["Start Vertex"], params["Destination Vertex"]),
};
