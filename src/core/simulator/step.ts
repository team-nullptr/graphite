import type { Color } from "~/types/color";
import { Graph } from "./graph";
import { ColumnDef } from "@tanstack/react-table";

export type Highlights = Map<string, Color>;

export type StepState<D> = {
  data: D[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<D, any>[];
};

export type Step<D> = {
  description: string;
  state: StepState<D>;
  highlights: Highlights;
};

export type AlgorithmFn = <D>(graph: Graph) => Step<D>[];
