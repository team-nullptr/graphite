import { dijkstra } from "./dijkstra";
import { dfs } from "./dfs";
import { bfs } from "./bfs";
import { tarjan } from "./tarjan";
// import { scc } from "./scc";
import { Algorithm } from "../algorithm";

export const algorithms = [
  dfs,
  bfs,
  // scc,
  dijkstra,
  tarjan,
] as Algorithm<object>[];
