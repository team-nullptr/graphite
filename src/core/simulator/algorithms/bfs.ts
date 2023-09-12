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
  return new ArrayStateBuilder({ title: "Queue" })
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
      description: `Push starting vertex ${startingVertex} to the queue.`,
    })
      .state([buildStackState([...stack], [stack.length - 1]), buildVisitOrderState([...visited])])
      .verticesHighlights(new Map([[startingVertex, "sky"]]))
      .build()
  );

  while (stack.length !== 0) {
    const currentId = stack.shift()!;
    const current = graph.vertices[currentId]!;

    steps.push(
      new StepBuilder({
        description: `Get first vertex ${currentId} from the queue.`,
      })
        .state([buildStackState([currentId, ...stack], [0]), buildVisitOrderState([...visited])])
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
        description: "Push all adjacent vertices to the queue.",
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
      description: "There is no more vertices in the queue. End the algorithm.",
    })
      .state([buildStackState([...stack]), buildVisitOrderState([...visited])])
      .verticesHighlights(visitedHighlights(visited))
      .build()
  );

  return steps;
}

export interface IterativeBFSAlgorithmParams {
  "Start Vertex": string;
}

export const bfs: Algorithm<IterativeBFSAlgorithmParams> = {
  name: "Iterative Breath First Search",
  description: "Visits all nodes of a graph.",
  tags: ["exploration"],
  params: {
    "Start Vertex": { type: "vertex", required: true },
  },
  stepGenerator(graph, params) {
    return algorithm(graph, params["Start Vertex"]);
  },
};
