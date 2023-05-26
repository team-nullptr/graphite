// export interface Project {
//   readonly id: string;
//   name: string;
//   createdAt: number;
//   modifiedAt: number;
//   graph: Graph;
// }

// TODO: These are temporary types.

export type ProjectMetadata = {
  id: string;
  name: string;
};

export type Project = {
  metadata: ProjectMetadata;
};
