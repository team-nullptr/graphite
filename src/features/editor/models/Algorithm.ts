import { Graph } from "../../../engine/runner/graph";

export type Algorithm = {
  readonly id: string;
  name: string;
  impl: (graph: Graph) => string[];
};
