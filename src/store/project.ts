import { create } from "zustand";
import { Graph } from "../engine/graph";
import { devtools } from "zustand/middleware";

export type ProjectStore = {
  graph: Graph;
  setGraph: (graph: Graph) => void;
};

export const useProjectStore = create<ProjectStore>()(
  devtools((set) => ({
    graph: new Graph(),
    setGraph: (graph) => set(() => ({ graph })),
  }))
);
