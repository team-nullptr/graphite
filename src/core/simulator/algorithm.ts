import type { Color } from "~/types/color";
import { Graph } from "./graph";
import { ColumnDef } from "@tanstack/react-table";

export type Highlight = [string, Color];
export type Highlights = Map<string, Color>;

export type TableState = {
  type: "table";
  data: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any, any>[];
};

export type ArrayState = {
  type: "array";
  title: string;
  data: string[];
  highlighted: Set<number>;
};

export type State = TableState | ArrayState | undefined;

export type Step = {
  description: string;
  state: State[];
  highlights: Highlights;
};

export type AlgorithmFn = (graph: Graph) => Step[];

export type Algorithm = {
  name: string;
  description: string;
  tags: string[];
  algorithm: (graph: Graph, startingVertex: string) => Step[];
};
