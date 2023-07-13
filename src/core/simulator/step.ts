import { Graph } from "./graph";

export type Highlights = Map<string, number>;

export type Step = {
  description: string;
  stepState: string;
  highlights: Highlights;
};

export type AlgorithmFn = (graph: Graph) => Step[];
