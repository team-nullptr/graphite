/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Algorithm } from "../algorithm";
import { Graph } from "../graph";
import { Step } from "../step";

type DFSVisitType = "Discover" | "Finish";

type DFSTimestamps = {
  discovery: number;
  finish: number;
};

type DFSContext = {
  timer: number;
  timestamps: Record<string, DFSTimestamps>;
};

type DFSVisit = {
  type: DFSVisitType;
  vertexId: string;
};

function dfsVisit(context: DFSContext, graph: Graph, visited: Set<string>, vertexId: string) {
  const stack: Array<DFSVisit> = [{ type: "Discover", vertexId: vertexId }];

  while (stack.length > 0) {
    context.timer += 1;
    const { type, vertexId } = stack.pop()!;

    if (type === "Finish") {
      context.timestamps[vertexId].finish = context.timer;
      continue;
    }

    context.timestamps[vertexId].discovery = context.timer;
    stack.push({ type: "Finish", vertexId: vertexId });
    visited.add(vertexId);

    for (const edge of graph.vertices[vertexId].outs) {
      const { to } = graph.edges[edge]!;
      if (visited.has(to)) continue;
      stack.push({ type: "Discover", vertexId: to });
    }
  }
}

function dfs(graph: Graph, startingVertexId?: string) {
  const vertices = Object.values(graph.vertices);
  const visited = new Set<string>();

  const context: DFSContext = {
    timer: 0,
    timestamps: vertices.reduce((prev, curr) => {
      prev[curr.id] = {
        discovery: Infinity,
        finish: Infinity,
      };

      return prev;
    }, {} as Record<string, DFSTimestamps>),
  };

  // Prioritize user selected vertex.
  if (startingVertexId) {
    dfsVisit(context, graph, visited, startingVertexId);
  }

  for (const vertex of vertices) {
    if (!visited.has(vertex.id)) {
      dfsVisit(context, graph, visited, vertex.id);
    }
  }

  return context.timestamps;
}

function algorithm(graph: Graph, initialVertexId: string): Array<Step> {
  const timestamps = dfs(graph, initialVertexId);
  console.log(timestamps);
  return [];
}

// eslint-disable-next-line @typescript-eslint/ban-types
type SccParams = {
  "Starting Vertex": string;
};

export const scc: Algorithm<SccParams> = {
  name: "Strongly Connected Components",
  tags: [],
  description: "Finds strongly connected components in a directed acyclic graph.",
  guide: "",
  params: {
    "Starting Vertex": {
      type: "vertex",
      required: false,
    },
  },
  stepGenerator: (graph, params) => algorithm(graph, params["Starting Vertex"]),
};
