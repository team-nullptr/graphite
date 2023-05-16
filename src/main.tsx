import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Editor } from "./features/editor/Editor";
import { ProjectGrid } from "./features/projects/ProjectGrid";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "projects",
    children: [
      {
        path: "",
        element: <ProjectGrid />,
      },
      {
        path: ":projectId",
        element: <Editor />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
