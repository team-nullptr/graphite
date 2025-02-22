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
    header: "Lowest Reachable Discovery Time",
    cell: (info) => {
      const { value, updated } = info.getValue();
      return (
        <div
          className={cn("transition-all", updated && "animate-bounce font-extrabold text-sky-600")}
        >
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
  lowestReachable: Map<string, number>;
  discoveryTime: Map<string, number>;
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
      value: context.lowestReachable.get(id)!,
      updated: update?.lowestTime?.(id) ?? false,
    },
    discoveryTime: {
      value: context.discoveryTime.get(id)!,
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

function dfs(context: Context, currentId: string, stack: string[], parentId?: string) {
  const recursionStack = [...stack, currentId];

  context.visited.add(currentId);

  context.steps.push(
    new StepBuilder({ description: `Mark ${currentId} vertex as visited.` })
      .state(buildDefaultState(recursionStack, context))
      .verticesHighlights(new Map([...visitedHighlights(context), [currentId, "sky"]]))
      .build()
  );

  context.time++;
  context.lowestReachable.set(currentId, context.time);
  context.discoveryTime.set(currentId, context.time);

  context.steps.push(
    new StepBuilder({
      description: `Update ${currentId} vertex's Lowest Reachable Discovery Time.`,
    })
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

  let parentSkippedOnce = false;
  const current = context.graph.vertices[currentId]!;

  for (const edgeId of current.outs) {
    const edge = context.graph.edges[edgeId];
    const adjacentId = edge.to === current.id && !edge.directed ? edge.from : edge.to;

    // If adjacent node is current's node parent and we haven't skipped the parent yet
    // (this conditions ensures that we ignore just a single edge, in case there are many edges to parent)
    if (adjacentId === parentId && !parentSkippedOnce) {
      parentSkippedOnce = true;
      continue;
    }

    // If adjacent node was already visited (through BNF) it means that there exists a back edge to some
    // ancestor of current.
    if (context.visited.has(adjacentId)) {
      // Update lowest reachable discovery time from currentId.
      context.lowestReachable.set(
        currentId,
        Math.min(context.lowestReachable.get(currentId)!, context.discoveryTime.get(adjacentId)!)
      );

      context.steps.push(
        new StepBuilder({
          description: `Adjacent node ${adjacentId} was already visited. Update Lowest Reachable Discovery Time for ${currentId}`,
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

    // In every other case just continue the dfs algorithm.
    dfs(context, adjacentId, [...stack, currentId], currentId);

    // During back tracking update lowest distance to the current node.
    context.lowestReachable.set(
      currentId,
      Math.min(context.lowestReachable.get(currentId)!, context.lowestReachable.get(adjacentId)!)
    );

    context.steps.push(
      new StepBuilder({
        description: `Update Lowest Reachable Discovery Time for ${currentId}.`,
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

    // If during DFS backtracking adjacent node has lowest reachable discovery time greater than current id
    // edge between current and adjacent is a bridge.
    if (context.lowestReachable.get(adjacentId)! > context.discoveryTime.get(currentId)!) {
      context.bridges.push(edge);

      context.steps.push(
        new StepBuilder({
          description: `Lowest Reachable Discovery Time of adjacent node ${adjacentId} is greater than Lowest Reachable Discovery Time time of ${currentId}. This means that edge between ${edge.from} and ${edge.to} is a bridge!`,
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
    /** lowestReachable stores the lowest discovery time that can be reached from node or it's descendants. */
    lowestReachable: new Map<string, number>([...initialDistances]),
    /** discoveryTime is the tick at which node was visited by DFS algorithm. */
    discoveryTime: new Map<string, number>([...initialDistances]),
  };

  context.steps.push(
    new StepBuilder({
      description: "Initialize Lowest Reachable Discovery Time and Discovery Time.",
    })
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
      description: `Run dfs from the starting vertex ${startingVertex}`,
    })
      .state([
        buildBridgesState(context),
        buildRecursionStackState([]),
        new TableStateBuilder({ columns }).data(buildStateTableData(context)).build(),
      ])
      .verticesHighlights(new Map([[startingVertex, "sky"]]))
      .build()
  );

  dfs(context, startingVertex, [], undefined);

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

  return context.steps;
}

export interface TarjanAlgorithmParams {
  "Start Vertex": string;
}

export const tarjan: Algorithm<TarjanAlgorithmParams> = {
  name: "Tarjan's Bridge-Finding",
  description: "Finds bridges in a graph.",
  tags: ["bridges"],
  guide: `
  **Tarjan's Bridge-Finding Algorithm** is used to identify bridges in an undirected graph.

  For each node, we track two key values:

  1. **Discovery Time** – The depth in the DFS (Depth-First Search) recursion when the node was first encountered.
  2. **Lowest Reachable Discovery Time** – The earliest discovery time that can be reached from the node, either directly or through its descendants.

  #### Example:
  If a node **X** has a **Lowest Reachable Discovery Time** of \`10\`, it means that from **X** or any of its descendants, we can reach a node that was discovered at depth \`10\`.

  #### Bridge Condition:
  A bridge is found when an adjacent node **Y** has a **Lowest Reachable Discovery Time** that is **greater than** **X**'s **Discovery Time**. This means that **Y** and its subtree are only accessible through **X**, and removing the edge \`{X, Y}\` would disconnect the graph.
  `,
  params: {
    "Start Vertex": { type: "vertex", required: true },
  },
  stepGenerator: (graph, params) => algorithm(graph, params["Start Vertex"]),
};
