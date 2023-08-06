import React from "react";
import ReactDOM from "react-dom/client";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Editor } from "./pages/editor/Editor";
import "./index.css";

// const router = createBrowserRouter([
//   // TODO: I know this route does not make any sense .. but let's focus on features for now.
//   {
//     path: ":projectId",
//     element: <Editor />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>
);
