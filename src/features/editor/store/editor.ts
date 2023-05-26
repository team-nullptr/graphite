import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Graph } from "../../../engine/runner/graph";
import { Project, ProjectMetadata } from "../../../models/project";
import { Algorithm } from "../models/Algorithm";

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
      graph: new Graph(),
      algorithm: null,
      replaceGraph: (graph) => {
        set({ graph });
      },
      replaceAlgorithm: (algorithm) => {
        set({ algorithm });
      },
    }))
  );
};

export type EditorStore = ReturnType<typeof createEditorStore>;
