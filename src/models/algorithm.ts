import { Graph } from "../engine/runner/graph";
import { Instruction } from "../engine/runner/instruction";

export type Algorithm = {
  name: string;
  impl: (graph: Graph) => Instruction[];
};
