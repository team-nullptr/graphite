import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Project } from "../shared/models/Project";
import { nanoid } from "nanoid";
import { Graph } from "../engine/runner/graph";

export type ProjectStore = {
  projects: Map<string, Project>;
  updateProject: (project: Project) => Project;
  createProject: (project?: Partial<Project>) => Project;
};

export const useProjectStore = create<ProjectStore>()(
  devtools((set) => ({
    projects: new Map(),
    updateProject: (project: Project) => {
      set((state) => ({
        projects: new Map(state.projects).set(project.id, project),
      }));
      return project;
    },
    createProject: (project: Partial<Project> | undefined): Project => {
      const id = nanoid();
      const defaultProject: Project = {
        id: id,
        name: "Untitled",
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        graph: new Graph(),
      };
      const createdProject: Project = { ...defaultProject, ...project, id };
      set((state) => ({
        projects: new Map(state.projects).set(
          createdProject.id,
          createdProject
        ),
      }));
      return createdProject;
    },
  }))
);
