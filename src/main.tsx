import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Editor } from "./features/editor/Editor";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "projects/:projectId",
    element: <Editor />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
