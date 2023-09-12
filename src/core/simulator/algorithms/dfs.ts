/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Algorithm } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";
import type { Highlights } from "../highlight";
import { StepBuilder, type Step } from "../step";
import { ArrayStateBuilder } from "../state";

function buildVisitOrderState(visited: string[]) {
  return new ArrayStateBuilder({ title: "Visit Order" }).data(visited).build();
}

function buildStackState(stack: string[], highlighted: number[] = []) {
  return new ArrayStateBuilder({ title: "Stack" })
    .data(stack)
    .highlighted(new Set(highlighted))
    .build();
}

function visitedHighlights(visited: Set<string>): Highlights {
  return new Map([...visited].map((id) => [id, "slate"]));
}

function algorithm(graph: Graph, startingVertex: string): Step[] {
  const steps: Step[] = [];
  const visited = new Set<string>();
  const stack: string[] = [];

  stack.push(startingVertex);

  steps.push(
    new StepBuilder({
      description: `Put starting vertex ${startingVertex} on the stack.`,
    })
      .state([buildStackState([...stack], [stack.length - 1]), buildVisitOrderState([...visited])])
      .verticesHighlights(new Map([[startingVertex, "sky"]]))
      .build()
  );

  while (stack.length !== 0) {
    const currentId = stack.pop()!;
    const current = graph.vertices[currentId]!;

    steps.push(
      new StepBuilder({
        description: `Pop vertex ${currentId} from the stack.`,
      })
        .state([
          buildStackState([...stack, currentId], [stack.length]),
          buildVisitOrderState([...visited]),
        ])
        .verticesHighlights(new Map([[currentId, "sky"], ...visitedHighlights(visited)]))
        .build()
    );

    if (visited.has(currentId)) {
      steps.push(
        new StepBuilder({
          description: `Vertex ${currentId} was already visited. Continue to the next step.`,
        })
          .state([buildStackState([...stack]), buildVisitOrderState([...visited])])
          .verticesHighlights(new Map([[currentId, "slate"], ...visitedHighlights(visited)]))
          .build()
      );

      continue;
    }

    visited.add(current.id);

    steps.push(
      new StepBuilder({
        description: `Mark vertex ${currentId} as visited.`,
      })
        .state([buildStackState([...stack]), buildVisitOrderState([...visited])])
        .verticesHighlights(new Map([[current.id, "slate"], ...visitedHighlights(visited)]))
        .build()
    );

    const outsHighlights: Highlights = new Map();
    const addedIndexes = [];

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];
      const adjacentId = edge.to === current.id && !edge.directed ? edge.from : edge.to;

      if (visited.has(adjacentId)) {
        continue;
      }

      addedIndexes.push(stack.length);
      stack.push(adjacentId);
      outsHighlights.set(adjacentId, "sky");
    }

    steps.push(
      new StepBuilder({
        description: "Put all adjacent vertices to the stack.",
      })
        .state([buildStackState([...stack], addedIndexes), buildVisitOrderState([...visited])])
        .verticesHighlights(
          new Map([[current.id, "orange"], ...outsHighlights, ...visitedHighlights(visited)])
        )
        .build()
    );
  }

  steps.push(
    new StepBuilder({
      description: "There is no more vertices on the stack. End the algorithm.",
    })
      .state([buildStackState([...stack]), buildVisitOrderState([...visited])])
      .verticesHighlights(visitedHighlights(visited))
      .build()
  );

  return steps;
}

export interface IterativeDFSAlgorithmParams {
  "Start Vertex": string;
}

export const dfs: Algorithm<IterativeDFSAlgorithmParams> = {
  name: "Iterative Depth First Search",
  description: "See how iterative DFS explores your graph.",
  tags: ["exploration"],
  params: {
    "Start Vertex": { type: "vertex", required: true },
  },
  stepGenerator(graph, params) {
    return algorithm(graph, params["Start Vertex"]);
  },
};
