/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Algorithm } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";
import type { Highlight, Highlights } from "../highlight";
import type { Step } from "../step";

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
      state: [
        {
          type: "array",
          title: "Stack",
          data: [...stack],
          highlighted: new Set([stack.length - 1]),
        },
        {
          type: "array",
          title: "Visit Order",
          data: [...visited],
          highlighted: new Set(),
        },
      ],
      highlights,
    });
  }

  while (stack.length !== 0) {
    const currentId = stack.pop()!;
    const current = graph.vertices[currentId]!;

    {
      const highlights: Highlights = new Map([...savedHighlights, [currentId, "sky"]]);

      steps.push({
        description: `Pop vertex ${currentId} from the stack.`,
        state: [
          {
            type: "array",
            title: "Stack",
            data: [...stack, currentId],
            highlighted: new Set([stack.length]),
          },
          {
            type: "array",
            title: "Visit Order",
            data: [...visited],
            highlighted: new Set(),
          },
        ],
        highlights,
      });
    }

    if (visited.has(currentId)) {
      {
        const highlights: Highlights = new Map([...savedHighlights, [currentId, "slate"]]);

        steps.push({
          description: `Vertex ${currentId} was already visited. Continue to the next step.`,
          state: [
            {
              type: "array",
              title: "Stack",
              data: [...stack],
              highlighted: new Set(),
            },
            {
              type: "array",
              title: "Visit Order",
              data: [...visited],
              highlighted: new Set(),
            },
          ],
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
        state: [
          {
            type: "array",
            title: "Stack",
            data: [...stack],
            highlighted: new Set(),
          },
          {
            type: "array",
            title: "Visit Order",
            data: [...visited],
            highlighted: new Set(),
          },
        ],
        highlights,
      });
    }

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

    {
      const highlights: Highlights = new Map([
        ...outsHighlights,
        ...savedHighlights,
        [current.id, "orange"],
      ]);

      steps.push({
        description: "Put all adjacent vertices to the stack.",
        state: [
          {
            type: "array",
            title: "Stack",
            data: [...stack],
            highlighted: new Set(addedIndexes),
          },
          {
            type: "array",
            title: "Visit Order",
            data: [...visited],
            highlighted: new Set(),
          },
        ],
        highlights,
      });
    }

    savedHighlights.push([current.id, "slate"]);
  }

  {
    const highlights = new Map([...savedHighlights]);

    steps.push({
      description: "There is no more vertices on the stack. End the algorithm.",
      state: [
        {
          type: "array",
          title: "Stack",
          data: stack.slice(),
          highlighted: new Set(),
        },
        {
          type: "array",
          title: "Visit Order",
          data: [...visited],
          highlighted: new Set(),
        },
      ],
      highlights,
    });
  }

  return steps;
}

export const dfs: Algorithm = {
  name: "Iterative Depth First Search",
  description: "See how iterative DFS explores your graph.",
  tags: ["exploration"],
  algorithm,
};
