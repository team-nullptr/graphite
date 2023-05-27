import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Graph } from "../../../engine/runner/graph";
import { Project, ProjectMetadata } from "../../../models/project";
import { Algorithm } from "../../../models/algorithm";

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
  instructions: string[];
  replaceGraph: (graph: Graph) => void;
  replaceAlgorithm: (algorithm: Algorithm | null) => void;
};

export type CreateEditorStoreOpts = {
  project: Project;
};

export const createEditorStore = ({ project }: CreateEditorStoreOpts) => {
  return createStore<EditorState>()(
    devtools((set) => ({
      metadata: project.metadata,
      mode: editorModes.ASSEMBLY,
      graph: { edges: [], vertices: [] } as Graph,
      algorithm: null,
      instructions: [],
      replaceGraph: (graph) => {
        set((state) => ({
          graph,
          instructions: state.algorithm?.impl(graph) ?? [],
        }));
      },
      replaceAlgorithm: (algorithm) => {
        set((state) => ({
          algorithm,
          instructions: algorithm?.impl(state.graph) ?? [],
        }));
      },
    }))
  );
};

export type EditorStore = ReturnType<typeof createEditorStore>;
