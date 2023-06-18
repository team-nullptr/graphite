import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Graph } from "../../../engine/runner/graph";
import { Project, ProjectMetadata } from "../../../models/project";
import { Algorithm } from "../../../models/algorithm";
import { Instruction } from "../../../engine/runner/instruction";

export const editorModes = {
  ASSEMBLY: "ASSEMBLY",
  SIMULATION: "SIMULATION",
} as const;

export type EditorMode = (typeof editorModes)[keyof typeof editorModes];

export type EditorState = {
  metadata: ProjectMetadata;
  mode: EditorMode;
  graph: Graph;
  algorithm: Algorithm | null;
  instructions: Instruction[];
  replaceGraph: (graph: Graph) => void;
  replaceAlgorithm: (algorithm: Algorithm | null) => void;
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
      mode: editorModes.ASSEMBLY,
      graph: initialGraph,
      instructions: [],
      algorithm: null,
      replaceGraph: (graph) => {
        set((state) => ({
          graph,
          instructions: state.algorithm?.instructionsResolver(graph) ?? [],
        }));
      },
      replaceAlgorithm: (algorithm) => {
        set((state) => ({
          algorithm,
          instructions: algorithm?.instructionsResolver(state.graph) ?? [],
        }));
      },
    }))
  );
};

export type EditorStore = ReturnType<typeof createEditorStore>;