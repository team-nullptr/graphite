import { createStore } from "zustand";
import { Graph } from "~/core/simulator/graph";
import { Project, ProjectMetadata } from "~/types/project";
import { Step } from "~/core/simulator/algorithm";

type Mode =
  | {
      type: "IDLE";
    }
  | {
      type: "SIMULATION";
      steps: Step[];
    };

export type EditorState = {
  metadata: ProjectMetadata;
  mode: Mode;
  setMode: (mode: Mode) => void;
  graph: Graph;
  setGraph: (graph: Graph) => void;
};

export type CreateEditorStoreOpts = {
  project: Project;
};

const initialGraph: Graph = {
  edges: {},
  vertices: {},
};

export function createEditorStore({ project }: CreateEditorStoreOpts) {
  return createStore<EditorState>()((set) => ({
    metadata: project.metadata,

    // mode
    mode: {
      type: "IDLE",
    },
    setMode: (mode) => {
      set({
        mode,
      });
    },

    // graph
    graph: initialGraph,
    setGraph: (graph) => {
      set({
        graph,
      });
    },
  }));
}

export type EditorStore = ReturnType<typeof createEditorStore>;
