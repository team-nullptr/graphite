/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Algorithm, Highlight, Highlights, Step } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";

function algorithm(graph: Graph, startingVertex: string): Step[] {
  const steps: Step[] = [];
  const savedHighlights: Highlight[] = [];

  const visited = new Set<string>();
  const stack: string[] = [];

  stack.push(startingVertex);

  {
    const highlights: Highlights = new Map([[startingVertex, "sky"]]);

    steps.push({
      description: `Put starting vertex ${startingVertex} on the stack.`,
      state: [],
      highlights,
    });
  }

  while (stack.length !== 0) {
    const currentId = stack.shift()!;
    const current = graph.vertices[currentId]!;

    {
      const highlights: Highlights = new Map([...savedHighlights, [currentId, "sky"]]);

      steps.push({
        description: `Get first vertex ${currentId} from the array.`,
        state: [],
        highlights,
      });
    }

    if (visited.has(currentId)) {
      {
        const highlights: Highlights = new Map([...savedHighlights, [currentId, "slate"]]);

        steps.push({
          description: `Vertex ${currentId} was already visited. Continue to the next step.`,
          state: [],
          highlights,
        });
      }

      continue;
    }

    visited.add(current.id);

    {
      const highlights: Highlights = new Map([[current.id, "slate"], ...savedHighlights]);

      steps.push({
        description: `Mark vertex ${currentId} as visited.`,
        state: [],
        highlights,
      });
    }

    const outsHighlights: Highlights = new Map();

    for (const edgeId of current.outs) {
      const edge = graph.edges[edgeId];

      const adjacentId = edge.to === current.id && !edge.directed ? edge.from : edge.to;

      stack.push(adjacentId);
      outsHighlights.set(adjacentId, "sky");
    }

    {
      const highlights: Highlights = new Map([
        ...outsHighlights,
        ...savedHighlights,
        [current.id, "orange"],
      ]);

      steps.push({
        description: "Put all adjacent vertices to the stack.",
        state: [],
        highlights,
      });
    }

    savedHighlights.push([current.id, "slate"]);
  }

  {
    const highlights = new Map([...savedHighlights]);

    steps.push({
      description: "There is no more vertices on the stack. End the algorithm.",
      state: [],
      highlights,
    });
  }

  return steps;
}

export const bfs: Algorithm = {
  name: "Breath First Search",
  description: "Breath First Search algorithm visits all nodes of a graph.",
  tags: ["exploration"],
  algorithm,
};
