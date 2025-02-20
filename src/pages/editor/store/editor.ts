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

const initialCode = `graph {
  # This creates a node named "start"
  start;

  # This creates a node with cost of 100.
  a [cost = 100];
  b [cost = 200];

  # Commas are optional
  c [cost = 300]

  # This creates a path between a, b and c
  # in which every edge has cost of 25.
  a -- b -- c [cost = 25]

  # Use -> to represent a directed edge.
  d -> e -> f [cost = 50]

  # You don't have to specify the cost
  b -- e
}
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
