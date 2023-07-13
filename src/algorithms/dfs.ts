import { Graph, Vertex } from "../core/simulator/graph";
import { Step } from "../core/simulator/step";
import { Algorithm } from "../types/algorithm";

function* dfsInstructionGenerator(graph: Graph): IterableIterator<Step> {
  const visited = new Set<string>();
  const stack: string[] = [];

  let current: Vertex | undefined = Object.values(graph.vertices)[0];

  while (current) {
    yield {
      description: "Mark vertex as visited.",
      stepState: "",
      highlights: new Map(),
    };

    visited.add(current.id);

    yield {
      description: "Put all adjacent vertices to the stack.",
      stepState: "",
      highlights: new Map(),
    };

    for (const id of current.outs) {
      if (!visited.has(id)) {
        stack.push(id);
      }
    }

    yield {
      description: "Pop next element from the stack",
      stepState: "",
      highlights: new Map(),
    };

    current = graph.vertices[stack.pop() as string];
  }
}

const dfsInstructionResolver = (graph: Graph) => [
  ...dfsInstructionGenerator(graph),
];

export const dfs: Algorithm = {
  name: "Depth First Search",
  description: "Depth First Search algorithm visit all nodes of a graph.",
  tags: ["exploration"],
  algorithm: dfsInstructionResolver,
};
