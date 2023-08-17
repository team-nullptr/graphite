/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createColumnHelper } from "@tanstack/react-table";
import { Algorithm, State, Step } from "~/core/simulator/algorithm";
import { Edge, Graph } from "~/core/simulator/graph";
import { Color } from "~/types/color";
import { VertexPreview } from "~/shared/ui/VertexPreview";
import { cn } from "~/lib/utils";

type TarjanTableData = {
  vertex: {
    id: string;
    color?: Color;
  };
  lowestTime: {
    value: number;
    justUpdated: boolean;
  };
  discoveryTime: {
    value: number;
    justUpdated: boolean;
  };
};

const columnHelper = createColumnHelper<TarjanTableData>();

const columns = [
  columnHelper.accessor("vertex", {
    header: "Vertex",
    cell: (info) => {
      const { id, color } = info.getValue();
      return <VertexPreview color={color} label={id} />;
    },
  }),
  columnHelper.accessor("lowestTime", {
    header: "Lowest Time",
    cell: (info) => {
      const { value, justUpdated } = info.getValue();
      return (
        <span className={cn("block transition-all", justUpdated && "animate-pulse text-sky-500")}>
          {value}
        </span>
      );
    },
  }),
  columnHelper.accessor("discoveryTime", {
    header: "Discovery Time",
    cell: (info) => {
      const { value, justUpdated } = info.getValue();
      return (
        <span className={cn("block transition-all", justUpdated && "animate-pulse text-sky-500")}>
          {value}
        </span>
      );
    },
  }),
];

type Context = {
  graph: Graph;
  time: number;
  steps: Step[];
  bridges: Edge[];
  visited: Set<string>;
  lowest: Map<string, number>;
  discovery: Map<string, number>;
};

function dfs(context: Context, currentId: string, parentId?: string) {
  // Mark current node as visited
  context.visited.add(currentId);

  context.steps.push({
    description: `Mark ${currentId} vertex as visited.`,
    state: [
      {
        type: "table",
        columns,
        data: Object.keys(context.graph.vertices).map(
          (id): TarjanTableData => ({
            vertex: { id },
            lowestTime: {
              value: context.lowest.get(id)!,
              justUpdated: false,
            },
            discoveryTime: {
              value: context.discovery.get(id)!,
              justUpdated: false,
            },
          })
        ),
      },
    ],
    highlights: new Map(),
  });

  // Initialize discovery time and lowest time
  context.time++;
  context.lowest.set(currentId, context.time);
  context.discovery.set(currentId, context.time);

  context.steps.push({
    description: `Update ${currentId} vertex's lowest and discovery time.`,
    state: [
      {
        type: "table",
        columns,
        data: Object.keys(context.graph.vertices).map(
          (id): TarjanTableData => ({
            vertex: { id },
            lowestTime: {
              value: context.lowest.get(id)!,
              justUpdated: id === currentId,
            },
            discoveryTime: {
              value: context.discovery.get(id)!,
              justUpdated: id === currentId,
            },
          })
        ),
      },
    ],
    highlights: new Map(),
  });

  // Iterate through adjacent vertices
  const current = context.graph.vertices[currentId]!;

  for (const edgeId of current.outs) {
    const edge = context.graph.edges[edgeId];
    const adjacentId = edge.to === current.id && !edge.directed ? edge.from : edge.to;

    // Case 1. adjacent node is current node's parent
    if (adjacentId === parentId) {
      continue;
    }

    // Case 2. adjacent vertex was already visited
    if (context.visited.has(adjacentId)) {
      context.lowest.set(
        currentId,
        Math.min(context.lowest.get(currentId)!, context.discovery.get(adjacentId)!)
      );
      continue;
    }

    // Case 3. adjacent vertex was not visited yet
    dfs(context, adjacentId, currentId);

    context.lowest.set(
      currentId,
      Math.min(context.lowest.get(currentId)!, context.lowest.get(adjacentId)!)
    );

    if (context.lowest.get(adjacentId)! > context.lowest.get(currentId)!) {
      context.bridges.push(edge);
    }
  }
}

function algorithm(graph: Graph, startingVertex: string): Step[] {
  const vertexIds = Object.keys(graph.vertices);
  const initialDistances: [string, number][] = vertexIds.map((vertexId) => [vertexId, -1]);

  const context: Context = {
    graph,
    time: 0,
    steps: [],
    bridges: [],
    visited: new Set<string>(),
    lowest: new Map<string, number>([...initialDistances]),
    discovery: new Map<string, number>([...initialDistances]),
  };

  const initialState: State[] = [
    {
      type: "table",
      columns,
      data: vertexIds.map(
        (id): TarjanTableData => ({
          vertex: { id },
          lowestTime: {
            value: context.lowest.get(id)!,
            justUpdated: true,
          },
          discoveryTime: {
            value: context.discovery.get(id)!,
            justUpdated: true,
          },
        })
      ),
    },
  ];

  context.steps.push({
    description: "Initialize lowest time and discovery time.",
    state: initialState,
    highlights: new Map(),
  });

  context.steps.push({
    description: `Run dfs from the starting vertex ${startingVertex}.`,
    state: initialState,
    highlights: new Map(),
  });

  dfs(context, startingVertex, undefined);

  console.log(context.bridges);
  return context.steps;
}

export const tarjan: Algorithm = {
  name: "Looking for bridges with Tarjan's algorithm",
  description: "Finds bridges in a graph",
  tags: ["bridges"],
  algorithm,
};
