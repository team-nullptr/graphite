import { syntaxTree } from "@codemirror/language";
import { Graph } from "../graph";
import { EditorState } from "@codemirror/state";
import {
  Vertex,
  WeightedEdge,
  Edge,
  DirectedEdge,
  WeightedDirectedEdge,
  Id,
  Value,
} from "./gen/gdl.terms";
import { SyntaxNode } from "@lezer/common";

export const graphFromSource = (state: EditorState): Graph => {
  const graph = new Graph();
  const tree = syntaxTree(state);

  /** Util for parsing a vertex. */
  const parseVertex = (stmt: SyntaxNode) => {
    const idNode = stmt.getChild(Id);
    if (!idNode) throw new Error("Expected Id node");

    const valueNode = stmt.getChild(Value);
    if (!valueNode) throw new Error("Expected Value node");

    const id = state.sliceDoc(idNode.from, idNode.to);
    const value = parseFloat(state.sliceDoc(valueNode.from, valueNode.to));

    graph.addVertex(id, value);
  };

  /** Util for parsing an edge. */
  const parseEdge = (stmt: SyntaxNode, directed: boolean) => {
    const ids = stmt.getChildren(Id);

    const fromIdNode = ids[0];
    if (!fromIdNode) throw new Error("Expected from Id node");

    const toIdNode = ids[1];
    if (!toIdNode) throw new Error("Expected to Id node");

    const fromId = state.sliceDoc(fromIdNode.from, fromIdNode.to);
    const toId = state.sliceDoc(toIdNode.from, toIdNode.to);

    graph.addEdge(fromId, toId, null, directed);
  };

  const parseWeightedEdge = (stmt: SyntaxNode, directed: boolean) => {
    const ids = stmt.getChildren(Id);

    const fromIdNode = ids[0];
    if (!fromIdNode) throw new Error("Expected from Id node");

    const toIdNode = ids[1];
    if (!toIdNode) throw new Error("Expected to Id node");

    const weightNode = stmt.getChild(Value);
    if (!weightNode) throw new Error("Expected edge weight");

    const fromId = state.sliceDoc(fromIdNode.from, fromIdNode.to);
    const toId = state.sliceDoc(toIdNode.from, toIdNode.to);
    const weight = parseFloat(state.sliceDoc(weightNode.from, weightNode.to));

    graph.addEdge(fromId, toId, weight, directed);
  };

  tree.topNode
    .getChildren("Statement")
    // Sort statements so that all verticies are created before creating edges.
    .sort((stmt) => (stmt.type.id === Vertex ? -1 : 1))
    .forEach((stmt) => {
      switch (stmt.type.id) {
        case Vertex:
          parseVertex(stmt);
          break;
        case WeightedDirectedEdge:
          parseWeightedEdge(stmt, true);
          break;
        case DirectedEdge:
          parseEdge(stmt, true);
          break;
        case Edge:
          parseEdge(stmt, false);
          break;
        case WeightedEdge:
          parseWeightedEdge(stmt, false);
          break;
      }
    });

  return graph;
};
