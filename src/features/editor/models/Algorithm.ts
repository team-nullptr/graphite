import { Graph } from "../../../engine/runner/graph";

export interface Algorithm {
  readonly id: string;
  name: string;
}

export type AlgorithmValidator = (graph: Graph) => boolean;

export type AlgorithmWithValidator = Algorithm & {
  isValid?: AlgorithmValidator;
};
