/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Algorithm } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";
import type { Highlights } from "../highlight";
import { Labels, StepBuilder, type Step } from "../step";
import { ArrayStateBuilder, State, TableStateBuilder } from "../state";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

type DFSContext = {
  timer: number;
  steps: Array<Step>;
  visited: Set<string>;
  timestamps: Record<string, DFSTimestamp>;
};

type DFSTimestamp = {
  discover: number | null;
  finish: number | null;
};

type DFSVisit = {
  type: DFSVisitType;
  vertexId: string;
};

type DFSVisitType = "Discover" | "Finish";

type DFSStateTableData = {
  property: string;
  value: string;
};

const columnHelper = createColumnHelper<DFSStateTableData>();

const stateTableColumns = [
  columnHelper.accessor("property", {
    header: "Property",
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) => <p>{info.getValue()}</p>,
  }),
] as Array<ColumnDef<unknown, any>>;

function buildDFSStateTableState(time: number): State {
  return new TableStateBuilder({ columns: stateTableColumns })
    .data([{ property: "time", value: time.toString() }])
    .build();
}

function buildVisitOrderState(visited: string[]) {
  return new ArrayStateBuilder({ title: "Visit Order" }).data(visited).build();
}

function buildStackState(stack: Array<string>, highlighted: number[] = []) {
  return (
    new ArrayStateBuilder({ title: "Stack" })
      // TODO: Distinguish Discover from Finish visits
      .data(stack)
      .highlighted(new Set(highlighted))
      .build()
  );
}

function visitedHighlights(visited: Set<string>): Highlights {
  return new Map([...visited].map((id) => [id, "slate"]));
}

function timestampsToLabel(graph: Graph, timestampsMap: Record<string, DFSTimestamp>): Labels {
  const labels: Labels = new Map();
  const vertices = Object.values(graph.vertices);

  for (const vertex of vertices) {
    const timestamps = timestampsMap[vertex.id];
    labels.set(vertex.id, `${timestamps?.discover ?? "-"}/${timestamps.finish ?? "-"}`);
  }

  return labels;
}

function extractIdsFromDFSStack(stack: Array<DFSVisit>) {
  return stack.map((v) => v.vertexId);
}

function dfsVisit(context: DFSContext, graph: Graph, startingVertex: string) {
  const stack: Array<DFSVisit> = [{ type: "Discover", vertexId: startingVertex }];

  context.steps.push(
    new StepBuilder({
      description: `Put Discover operation for ${startingVertex} on the stack.`,
    })
      .state([
        buildStackState([...extractIdsFromDFSStack(stack)], [stack.length - 1]),
        buildVisitOrderState([...context.visited]),
        buildDFSStateTableState(context.timer),
      ])
      .labels(timestampsToLabel(graph, context.timestamps))
      .verticesHighlights(new Map([[startingVertex, "sky"], ...visitedHighlights(context.visited)]))
      .build()
  );

  while (stack.length !== 0) {
    context.timer++;

    context.steps.push(
      new StepBuilder({
        description: `Increment time.`,
      })
        .state([
          buildStackState(extractIdsFromDFSStack(stack)),
          buildVisitOrderState([...context.visited]),
          buildDFSStateTableState(context.timer),
        ])
        .labels(timestampsToLabel(graph, context.timestamps))
        .verticesHighlights(visitedHighlights(context.visited))
        .build()
    );

    const { type, vertexId } = stack.pop()!;
    const current = graph.vertices[vertexId]!;

    context.steps.push(
      new StepBuilder({
        description: `Pop ${type} operation for ${vertexId} from the stack.`,
      })
        .state([
          buildStackState([...extractIdsFromDFSStack(stack), vertexId], [stack.length]),
          buildVisitOrderState([...context.visited]),
          buildDFSStateTableState(context.timer),
        ])
        .labels(timestampsToLabel(graph, context.timestamps))
        .verticesHighlights(
          new Map([
            ...visitedHighlights(context.visited),
            [vertexId, type === "Discover" ? "sky" : "orange"],
          ])
        )
        .build()
    );

    if (type === "Finish") {
      context.timestamps[vertexId].finish = context.timer;
      context.steps.push(
        new StepBuilder({
          description: `Update finish time for ${vertexId}.`,
        })
          .state([
            buildStackState(extractIdsFromDFSStack(stack)),
            buildVisitOrderState([...context.visited]),
            buildDFSStateTableState(context.timer),
          ])
          .labels(timestampsToLabel(graph, context.timestamps))
          .verticesHighlights(
            new Map([...visitedHighlights(context.visited), [vertexId, "orange"]])
          )
          .build()
      );

      continue;
    }

    if (context.visited.has(vertexId)) {
      context.steps.push(
        new StepBuilder({
          description: `Vertex ${vertexId} was already discovered. Continue.`,
        })
          .state([
            buildStackState(extractIdsFromDFSStack(stack)),
            buildVisitOrderState([...context.visited]),
            buildDFSStateTableState(context.timer),
          ])
          .labels(timestampsToLabel(graph, context.timestamps))
          .verticesHighlights(new Map([[vertexId, "sky"], ...visitedHighlights(context.visited)]))
          .build()
      );

      continue;
    }

    stack.push({ type: "Finish", vertexId });
    context.visited.add(current.id);
    context.timestamps[vertexId].discover = context.timer;

    context.steps.push(
      new StepBuilder({
        description: `Mark vertex ${vertexId} as discovered and put Finish operation for ${vertexId}on the stack.`,
      })
        .state([
          buildStackState(extractIdsFromDFSStack(stack), [stack.length - 1]),
          buildVisitOrderState([...context.visited]),
          buildDFSStateTableState(context.timer),
        ])
        .labels(timestampsToLabel(graph, context.timestamps))
        .verticesHighlights(new Map([[current.id, "sky"], ...visitedHighlights(context.visited)]))
        .build()
    );

    const outsHighlights: Highlights = new Map();
    const addedIndexes = [];

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];
      const adjacentId = edge.to === current.id && !edge.directed ? edge.from : edge.to;

      if (context.visited.has(adjacentId)) {
        continue;
      }

      addedIndexes.push(stack.length);
      stack.push({ type: "Discover", vertexId: adjacentId });
      outsHighlights.set(adjacentId, "slate");
    }

    context.steps.push(
      new StepBuilder({
        description: "Put Discover operation for all adjacent unvisited vertices on the stack.",
      })
        .state([
          buildStackState([...extractIdsFromDFSStack(stack)], addedIndexes),
          buildVisitOrderState([...context.visited]),
          buildDFSStateTableState(context.timer),
        ])
        .labels(timestampsToLabel(graph, context.timestamps))
        .verticesHighlights(
          new Map([
            [current.id, "orange"],
            ...outsHighlights,
            ...visitedHighlights(context.visited),
          ])
        )
        .build()
    );
  }
}

function algorithm(graph: Graph, startingVertex?: string): Step[] {
  const vertices = Object.values(graph.vertices);

  const context: DFSContext = {
    timer: 0,
    steps: [],
    timestamps: vertices.reduce((prev, curr) => {
      prev[curr.id] = {
        discover: null,
        finish: null,
      };

      return prev;
    }, {} as Record<string, DFSTimestamp>),
    visited: new Set(),
  };

  if (startingVertex) {
    dfsVisit(context, graph, startingVertex);
  }

  for (const vertex of vertices) {
    if (!context.visited.has(vertex.id)) {
      dfsVisit(context, graph, vertex.id);
    }
  }

  context.steps.push(
    new StepBuilder({
      description: "All vertices have been visited. End the algorithm.",
    })
      .state([
        buildStackState([]),
        buildVisitOrderState([...context.visited]),
        buildDFSStateTableState(context.timer),
      ])
      .labels(timestampsToLabel(graph, context.timestamps))
      .verticesHighlights(visitedHighlights(context.visited))
      .build()
  );

  return context.steps;
}

export interface IterativeDFSAlgorithmParams {
  "Start Vertex": string;
}

export const dfs: Algorithm<IterativeDFSAlgorithmParams> = {
  name: "Depth First Search",
  description: "See how iterative DFS explores your graph.",
  tags: ["exploration"],
  guide: "",
  params: {
    "Start Vertex": { type: "vertex", required: false },
  },
  stepGenerator(graph, params) {
    return algorithm(graph, params["Start Vertex"]);
  },
};
