import type { Color } from "~/types/color";
import { Graph } from "./graph";

export type Highlights = Map<string, Color>;

export type Step = {
  description: string;
  stepState: string;
  highlights: Highlights;
};

export type AlgorithmFn = (graph: Graph) => Step[];
