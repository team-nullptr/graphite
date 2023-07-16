import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Graph } from "~/core/simulator/graph";
import { Project, ProjectMetadata } from "~/types/project";
import { Step } from "~/core/simulator/step";

type Mode =
  | {
      mode: "IDLE";
    }
  | {
      mode: "SIMULATION";
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

export const createEditorStore = ({ project }: CreateEditorStoreOpts) => {
  return createStore<EditorState>()(
    devtools((set) => ({
      metadata: project.metadata,

      // mode
      mode: {
        mode: "IDLE",
      },
      setMode: (mode: Mode) => {
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
    }))
  );
};

export type EditorStore = ReturnType<typeof createEditorStore>;
