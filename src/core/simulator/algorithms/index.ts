import { dijkstra } from "./dijkstra";
import { dfs } from "./dfs";
import { bfs } from "./bfs";
import { tarjan } from "./tarjan";
import { Algorithm } from "../algorithm";

export const algorithms = [dijkstra, dfs, bfs, tarjan] as Algorithm<object>[];
