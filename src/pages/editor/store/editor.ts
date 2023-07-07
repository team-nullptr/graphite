import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Graph } from "../../../core/simulator/graph";
import { Project, ProjectMetadata } from "../../../types/project";
import { Algorithm } from "../../../types/algorithm";
import { Instruction } from "../../../core/simulator/instruction";

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
        set({
          graph,
        });
      },
      replaceAlgorithm: (algorithm) => {
        set({
          algorithm,
        });
      },
    }))
  );
};

export type EditorStore = ReturnType<typeof createEditorStore>;
