import type { Color } from "~/types/color";
import { Graph } from "./graph";
import { ColumnDef } from "@tanstack/react-table";

export type Highlights = Map<string, Color>;

export type DijkstraStepStateData = {
  vertex: {
    id: string;
    color?: Color;
  };
  distance: {
    value: number;
    justUpdated: boolean;
  };
};

export type DijkstraStepState = {
  data: DijkstraStepStateData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<DijkstraStepStateData, any>[];
};

export type Step<S> = {
  description: string;
  state: S;
  highlights: Highlights;
};

export type AlgorithmFn = <D>(graph: Graph) => Step<D>[];
