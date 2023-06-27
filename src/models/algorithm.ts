import { Graph } from "../core/simulator/graph";
import { Instruction } from "../core/simulator/instruction";

export type Algorithm = {
  name: string;
  instructionsResolver: (graph: Graph) => Instruction[];
};
