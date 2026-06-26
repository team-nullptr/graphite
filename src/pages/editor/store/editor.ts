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
  # This creates a node with ID "a"
  a [cost = 100];
  # This creates a node with cost of 100.
  b [cost = 200];

  # Semicolons are optional
  c [cost = 300]

  # This creates a path between a, b, c, d and e
  # in which every edge has cost of 20.
  a -- b -- c -- d -- e -- a [cost=20]

  # You can create nodes while creating paths
  a -- d [cost=10]

  # You don't have to specify the cost
  b -- e

  # Use -> to represent a directed edge.
  a0 -- b0 -> c0 -> d0 -- e0 [cost=12.4];

  a -- a0 [cost=0.5];
  b -- b0 [cost=0.8];
  c -- c0 [cost=0.3];
  d -- d0 [cost=0.3];
  e -- e0 [cost=0.8];

  # You can also give edges explicit names

  x -- z [name="Connection"]
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
