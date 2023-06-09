import { Graph } from "./graph";

export type Highlights = Map<string, number>;

export type Instruction = {
  description: string;
  stepState: string;
  highlights: Highlights;
};

export type AlgorithmFn = (graph: Graph) => Instruction[];
