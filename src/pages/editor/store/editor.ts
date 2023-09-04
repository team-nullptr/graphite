import { createStore } from "zustand";
import { Graph } from "~/core/simulator/graph";
import { Step } from "~/core/simulator/step";
import { Project, ProjectMetadata } from "~/types/project";

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
  code: string;
  setCode: (code: string) => void;
  graph: Graph;
  setGraph: (graph: Graph) => void;
};

export type CreateEditorStoreOpts = {
  project: Project;
};

const initialCode = `# Declare vertices
vertex([A, B, C, D, E, F, G])

# Add edges
edge(A, [B, C, D, E], 5)
edge(D, C)
edge(F, B)
edge(B, C)

# Add directed edges
arc(A, [F, G])
arc(E, C, 8)

# Learn more at Graphene Docs
# https://github.com/team-nullptr/graphite
`;

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

    // Code
    code: initialCode,
    setCode: (code) => {
      set({ code });
    },

    // Graph
    graph: initialGraph,
    setGraph: (graph) => {
      set({ graph });
    },
  }));
}

export type EditorStore = ReturnType<typeof createEditorStore>;
