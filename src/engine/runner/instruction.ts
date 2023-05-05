import { Graph } from "./graph";

export type Instruction = {
  description: string;
  highlights: { id: string; color: string }[];
};

export type AlgorithmFn = (graph: Graph) => Instruction[];
