import { Graph } from "../../engine/runner/graph";

export interface Project {
  readonly id: string;
  name: string;
  createdAt: number;
  modifiedAt: number;
  graph: Graph;
}
