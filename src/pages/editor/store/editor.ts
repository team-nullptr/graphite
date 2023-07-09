import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Graph } from "../../../core/simulator/graph";
import { Project, ProjectMetadata } from "../../../types/project";
import { Algorithm } from "../../../types/algorithm";

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
  setGraph: (graph: Graph) => void;
  setAlgorithm: (algorithm: Algorithm | null) => void;
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
      algorithm: null,
      setGraph: (graph) => {
        set({
          graph,
        });
      },
      setAlgorithm: (algorithm) => {
        set({
          algorithm,
        });
      },
    }))
  );
};

export type EditorStore = ReturnType<typeof createEditorStore>;
