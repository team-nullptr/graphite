import { createStore } from "zustand";
import { Algorithm, AlgorithmParamDefinitions } from "~/core/simulator/algorithm";
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
  algorithm: Algorithm<object> | undefined;
  setAlgorithm: (algorithm?: Algorithm<object>) => void;
  algorithmParams: AlgorithmParamDefinitions<object>;
  setAlgorithmParams: (algorithmParams: AlgorithmParamDefinitions<object>) => void;
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
edge(B, [C, D])

# Add directed edges
arc(A, [F, G])
arc(E, C, 8)

graph_complete([H, I, J, K, L, M])

arc(G, H)

tree_binary([N, O, P, R, S, T, U, W, X, Y, Z])

edge(O, A)

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

    // Algorithm
    algorithm: undefined,
    setAlgorithm(algorithm) {
      set({ algorithm });
    },
    algorithmParams: {},
    setAlgorithmParams(algorithmParams) {
      set({ algorithmParams });
    },
  }));
}

export type EditorStore = ReturnType<typeof createEditorStore>;
