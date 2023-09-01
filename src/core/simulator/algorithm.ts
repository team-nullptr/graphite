import { Graph } from "./graph";
import { Step } from "./step";

export type AlgorithmFn = (graph: Graph) => Step[];

export type Algorithm = {
  name: string;
  description: string;
  tags: string[];
  algorithm: (graph: Graph, startingVertex: string) => Step[];
};
