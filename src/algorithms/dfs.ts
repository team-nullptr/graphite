import { Graph, Vertex } from "~/core/simulator/graph";
import { Highlights, Step } from "~/core/simulator/step";
import { Algorithm } from "~/types/algorithm";
import { Color } from "~/types/color";

const algorithm = (graph: Graph): Step<undefined>[] => {
  const steps: Step<undefined>[] = [];
  const savedHighlights: [string, Color][] = [];

  const visited = new Set<string>();
  const stack: string[] = [];

  let current: Vertex | undefined = Object.values(graph.vertices)[0];

  while (current && !visited.has(current.id)) {
    {
      const highlights: Highlights = new Map([
        [current.id, "sky"],
        ...savedHighlights,
      ]);

      steps.push({
        description: "Mark vertex as visited.",
        state: undefined,
        highlights,
      });
    }

    visited.add(current.id);

    const outsHighlights: Highlights = new Map();

    for (const id of current.outs) {
      const targetVertexId = graph.edges[id].to;

      if (!visited.has(targetVertexId)) {
        stack.push(targetVertexId);
        outsHighlights.set(targetVertexId, "sky");
      }
    }

    {
      const highlights: Highlights = new Map([
        ...outsHighlights,
        ...savedHighlights,
        [current.id, "orange"],
      ]);

      steps.push({
        description:
          "Put all adjacent vertices that were not visited to the stack.",
        state: undefined,
        highlights,
      });
    }

    savedHighlights.push([current.id, "slate"]);
    current = graph.vertices[stack.pop()!];

    {
      const highlights = new Map([...savedHighlights]);

      steps.push({
        description: "Pop next element from the stack.",
        state: undefined,
        highlights,
      });
    }
  }

  {
    const highlights = new Map([...savedHighlights]);

    steps.push({
      description: "There is no more vertices on the stack.",
      state: undefined,
      highlights,
    });
  }

  return steps;
};

export const dfs: Algorithm<undefined> = {
  name: "Depth First Search",
  description: "Depth First Search algorithm visit all nodes of a graph.",
  tags: ["exploration"],
  algorithm,
};
