import { Graph } from "../core/simulator/graph";
import { Step } from "../core/simulator/step";

export type Algorithm = {
  name: string;
  description: string;
  tags: string[];
  algorithm: (graph: Graph, startingVertex: string) => Step[];
};
