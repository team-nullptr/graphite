import { Graph } from "../engine/runner/graph";

export type Algorithm = {
  name: string;
  impl: (graph: Graph) => string[];
};
