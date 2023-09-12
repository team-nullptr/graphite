/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { Edge, Graph } from "~/core/simulator/graph";
import { cn } from "~/lib/utils";
import { VertexPreview } from "~/shared/ui/VertexPreview";
import { ArrayStateBuilder, State, TableStateBuilder } from "../state";
import { Step, StepBuilder } from "../step";

import type { Algorithm } from "~/core/simulator/algorithm";
import type { Color } from "~/types/color";
import { Highlight, Highlights } from "../highlight";

type StateTableData = {
  vertex: { id: string; color?: Color };
  lowestTime: {
    value: number;
    updated: boolean;
  };
  discoveryTime: {
    value: number;
    updated: boolean;
  };
};

type StateTableDataUpdate = Partial<
  Record<keyof Omit<StateTableData, "vertex">, (id: string) => void>
>;

const columnHelper = createColumnHelper<StateTableData>();

const columns = [
  columnHelper.accessor("vertex", {
    header: "Vertex",
    cell: (info) => {
      const { id, color } = info.getValue();
      return <VertexPreview color={color} label={id} />;
    },
  }),
  columnHelper.accessor("lowestTime", {
    header: "Lowest Discovery Time",
    cell: (info) => {
      const { value, updated } = info.getValue();
      return (
        <div className={cn("transition-all", updated && "animate-bounce text-sky-600")}>
          {value}
        </div>
      );
    },
  }),
  columnHelper.accessor("discoveryTime", {
    header: "Discovery Time",
    cell: (info) => {
      const { value, updated } = info.getValue();
      return (
        <div className={cn("transition-all", updated && "animate-bounce text-sky-600")}>
          {value}
        </div>
      );
    },
  }),
] as ColumnDef<unknown, any>[];

type Context = {
  graph: Graph;
  time: number;
  steps: Step[];
  bridges: Edge[];
  visited: Set<string>;
  lowest: Map<string, number>;
  discovery: Map<string, number>;
};

function buildRecursionStackState(recursion: string[]) {
  return new ArrayStateBuilder({ title: "DFS recursion stack" }).data(recursion).build();
}

function buildBridgesState(context: Context) {
  return new ArrayStateBuilder({ title: "Found bridges" })
    .data(context.bridges.map((edge) => `${edge.from}:${edge.to}`))
    .build();
}

function buildStateTableData(context: Context, update?: StateTableDataUpdate): StateTableData[] {
  return Object.keys(context.graph.vertices).map((id) => ({
    vertex: { id },
    lowestTime: {
      value: context.lowest.get(id)!,
      updated: update?.lowestTime?.(id) ?? false,
    },
    discoveryTime: {
      value: context.discovery.get(id)!,
      updated: update?.discoveryTime?.(id) ?? false,
    },
  }));
}

function buildDefaultState(recursion: string[], context: Context): State[] {
  return [
    buildBridgesState(context),
    buildRecursionStackState(recursion),
    new TableStateBuilder({ columns }).data(buildStateTableData(context)).build(),
  ];
}

function visitedHighlights(context: Context): Highlights {
  return new Map([...context.visited.values()].map((id) => [id, "slate"]));
}

function tarjans(context: Context, currentId: string, stack: string[], parentId?: string) {
  const recursionStack = [...stack, currentId];

  context.visited.add(currentId);

  context.steps.push(
    new StepBuilder({ description: `Mark ${currentId} vertex as visited.` })
      .state(buildDefaultState(recursionStack, context))
      .verticesHighlights(new Map([...visitedHighlights(context), [currentId, "sky"]]))
      .build()
  );

  context.time++;
  context.lowest.set(currentId, context.time);
  context.discovery.set(currentId, context.time);

  context.steps.push(
    new StepBuilder({ description: `Update ${currentId} vertex's lowest discovery time.` })
      .state([
        buildBridgesState(context),
        buildRecursionStackState(recursionStack),
        new TableStateBuilder({ columns })
          .data(
            buildStateTableData(context, {
              lowestTime: (id) => id === currentId,
              discoveryTime: (id) => id === currentId,
            })
          )
          .build(),
      ])
      .verticesHighlights(new Map([...visitedHighlights(context), [currentId, "sky"]]))
      .build()
  );

  const current = context.graph.vertices[currentId]!;

  for (const edgeId of current.outs) {
    const edge = context.graph.edges[edgeId];
    const adjacentId = edge.to === current.id && !edge.directed ? edge.from : edge.to;

    if (adjacentId === parentId) {
      continue;
    }

    if (context.visited.has(adjacentId)) {
      context.lowest.set(
        currentId,
        Math.min(context.lowest.get(currentId)!, context.discovery.get(adjacentId)!)
      );

      context.steps.push(
        new StepBuilder({
          description: `Adjacent node ${adjacentId} was already visited. Update lowest discovery time for ${currentId}`,
        })
          .state([
            buildBridgesState(context),
            buildRecursionStackState(recursionStack),
            new TableStateBuilder({ columns })
              .data(
                buildStateTableData(context, {
                  lowestTime: (id) => id === currentId,
                })
              )
              .build(),
          ])
          .verticesHighlights(new Map([...visitedHighlights(context), [currentId, "sky"]]))
          .build()
      );

      continue;
    }

    context.steps.push(
      new StepBuilder({
        description: `Run DFS recursively for ${currentId}'s adjacent node ${adjacentId}.`,
      })
        .state(buildDefaultState(recursionStack, context))
        .verticesHighlights(new Map([...visitedHighlights(context), [adjacentId, "orange"]]))
        .build()
    );

    tarjans(context, adjacentId, [...stack, currentId], currentId);

    context.lowest.set(
      currentId,
      Math.min(context.lowest.get(currentId)!, context.lowest.get(adjacentId)!)
    );

    context.steps.push(
      new StepBuilder({
        description: `Update lowest discovery time for ${currentId}.`,
      })
        .state([
          buildBridgesState(context),
          buildRecursionStackState(recursionStack),
          new TableStateBuilder({ columns })
            .data(buildStateTableData(context, { lowestTime: (id) => id === currentId }))
            .build(),
        ])
        .verticesHighlights(visitedHighlights(context))
        .build()
    );

    if (context.lowest.get(adjacentId)! > context.discovery.get(currentId)!) {
      context.bridges.push(edge);

      context.steps.push(
        new StepBuilder({
          description: `Lowest discovery time of adjacent node ${adjacentId} is greater than lowest discovery time of ${currentId}. This means that edge between ${edge.from} and ${edge.to} is a bridge!`,
        })
          .state(buildDefaultState(recursionStack, context))
          .verticesHighlights(visitedHighlights(context))
          .build()
      );
    }
  }

  context.steps.push(
    new StepBuilder({
      description: "All adjacent nodes processed, return to the parent vertex.",
    })
      .state(buildDefaultState(recursionStack, context))
      .verticesHighlights(visitedHighlights(context))
      .build()
  );
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

  context.steps.push(
    new StepBuilder({ description: "Initialize lowest time and discovery time." })
      .state([
        buildBridgesState(context),
        buildRecursionStackState([]),
        new TableStateBuilder({ columns })
          .data(
            buildStateTableData(context, {
              lowestTime: () => true,
              discoveryTime: () => true,
            })
          )
          .build(),
      ])
      .build()
  );

  context.steps.push(
    new StepBuilder({
      description: `Run recursive dfs from the starting vertex ${startingVertex}`,
    })
      .state([
        buildBridgesState(context),
        buildRecursionStackState([]),
        new TableStateBuilder({ columns }).data(buildStateTableData(context)).build(),
      ])
      .verticesHighlights(new Map([[startingVertex, "sky"]]))
      .build()
  );

  tarjans(context, startingVertex, [], undefined);

  context.steps.push(
    new StepBuilder({ description: "All vertices had been visited. End the algorithm." })
      .state([
        buildBridgesState(context),
        buildRecursionStackState([]),
        new TableStateBuilder({ columns }).data(buildStateTableData(context)).build(),
      ])
      .verticesHighlights(
        new Map([
          ...visitedHighlights(context),
          ...context.bridges.flatMap((edge) => [
            [edge.from, "sky"] satisfies Highlight,
            [edge.to, "sky"] satisfies Highlight,
          ]),
        ])
      )
      .edgesHighlights(new Map(context.bridges.map((edge) => [edge.id, "sky"])))
      .build()
  );

  console.log(context.bridges);
  return context.steps;
}

export interface TarjanAlgorithmParams {
  "Start Vertex": string;
}

export const tarjan: Algorithm<TarjanAlgorithmParams> = {
  name: "Bridge finding with Tarjan's algorithm",
  description: "Finds bridges in a graph.",
  tags: ["bridges"],
  params: {
    "Start Vertex": { type: "vertex", required: true },
  },
  stepGenerator: (graph, params) => {
    return algorithm(graph, params["Start Vertex"]);
  },
};
