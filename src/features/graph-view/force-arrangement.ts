import { Graph } from "../../engine/runner/graph";
import { Vec2d } from "./vec2d";

type Arrangement = Record<string, Vec2d>;

const repulsiveForce = (source: Vec2d, adj: Vec2d): Vec2d => {
  const force = adj
    .vecTo(source)
    .multiply(
      10 / Math.pow(Math.E, 0.2 * source.distanceTo(adj)) +
        0.5 / Math.pow(source.distanceTo(adj), 2)
    );

  return force;
};

const attractiveForce = (source: Vec2d, adj: Vec2d): Vec2d => {
  const spring = 0.2;
  const springLength = 30;

  const springForce = source
    .vecTo(adj)
    .multiply(spring * Math.log(adj.distanceTo(source) / springLength));

  return springForce;
};

type ForceArrangeOpts = {
  threshold: number;
  iterations: number;
  coolingFactor: number;
};

const defaultOptions: ForceArrangeOpts = {
  threshold: 0.1,
  iterations: 1000,
  coolingFactor: 0.995,
};

export const randomArrange = (graph: Graph) => {
  return Object.keys(graph.vertices).reduce((arrangement, vId) => {
    arrangement[vId] = new Vec2d([
      Math.random() * 100 + 25,
      Math.random() * 100 + 25,
    ]);

    return arrangement;
  }, {} as Arrangement);
};

export const forceArrange = (
  graph: Graph,
  arrangement: Arrangement,
  options?: ForceArrangeOpts
) => {
  const { threshold, iterations, coolingFactor } = {
    ...defaultOptions,
    ...options,
  };

  const forces: Record<string, Vec2d> = {};
  // let t = 0;

  const vertices = Object.keys(graph.vertices);

  // while (t < iterations) {
  for (const vertexId of vertices) {
    // Repulsive force
    const finalRepulsiveForce = new Vec2d([0, 0]);

    for (const targetVertexId of vertices) {
      if (vertexId === targetVertexId) {
        continue;
      }

      finalRepulsiveForce.add(
        repulsiveForce(arrangement[vertexId], arrangement[targetVertexId])
      );
    }

    // Attractive force
    const finalAttractiveForce = new Vec2d([0, 0]);
    const vertex = graph.vertices[vertexId];

    for (const edgeId of new Set([...vertex.outs, ...vertex.ins])) {
      const edge = graph.edges[edgeId];
      const adjacentVertexId = edge.to === vertexId ? edge.from : edge.to;

      if (vertexId === adjacentVertexId) {
        continue;
      }

      finalAttractiveForce.add(
        attractiveForce(arrangement[vertexId], arrangement[adjacentVertexId])
      );
    }

    forces[vertexId] = new Vec2d([0, 0])
      .add(finalAttractiveForce)
      .add(finalRepulsiveForce);
  }

  const maxForce = Math.max(
    ...Object.values(forces).map((force) => force.len())
  );

  if (maxForce < threshold) {
    return arrangement;
  }

  for (const vertexId of vertices) {
    const finalForce = forces[vertexId].multiply(coolingFactor);
    arrangement[vertexId].add(finalForce);
  }

  // t++;
  // forces = {};
  // }

  return arrangement;
};
