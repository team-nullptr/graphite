import { Graph, Vertex } from "../../../core/simulator/graph";
import { Arrangement } from "../types/arrangement";
import { Vec2 } from "../types/vec2";

const repulsiveForce = (source: Vec2, adj: Vec2): Vec2 => {
  const forceStrength = 50;
  const forceChillout = 1 / 20;

  return adj
    .vecTo(source)
    .multiply(
      forceStrength /
        (1 + Math.pow(Math.E, forceChillout * source.distanceTo(adj)))
    );
};

const attractiveForce = (source: Vec2, adj: Vec2): Vec2 => {
  const spring = 0.01;
  const springLength = 100;

  return source
    .vecTo(adj)
    .multiply(spring * Math.log(adj.distanceTo(source) / springLength));
};

const computeRepulsiveForce = (
  vertex: Vertex,
  vertices: Vertex[],
  arrangement: Arrangement
): Vec2 => {
  const totalForce = new Vec2([0, 0]);

  for (const currentVertex of vertices) {
    if (currentVertex.id === vertex.id) {
      continue;
    }

    const force = repulsiveForce(
      arrangement[vertex.id],
      arrangement[currentVertex.id]
    );

    totalForce.add(force);
  }

  return totalForce;
};

const computeAttractiveForce = (
  vertex: Vertex,
  graph: Graph,
  arrangement: Arrangement
): Vec2 => {
  const processedEdges = new Set<string>();
  const totalForce = new Vec2([0, 0]);
  const adjacentEdges = [...vertex.ins, ...vertex.outs];

  for (const edgeId of adjacentEdges) {
    if (processedEdges.has(edgeId)) {
      continue;
    }

    const edge = graph.edges[edgeId];
    const adjacentVertexId = edge.to === vertex.id ? edge.from : edge.to;

    if (vertex.id === adjacentVertexId) {
      continue;
    }

    const force = attractiveForce(
      arrangement[vertex.id],
      arrangement[adjacentVertexId]
    );

    processedEdges.add(edgeId);
    totalForce.add(force);
  }

  return totalForce;
};

export type ComputeForcesOpts = {
  threshold?: number;
  coolingFactor?: number;
  ignore?: Set<string>;
};

const defaultComputeForcesOpts: Required<ComputeForcesOpts> = {
  threshold: 0.01,
  coolingFactor: 0.995,
  ignore: new Set(),
};

// TODO: There is a bug when you paste graph definition into editor this crashes :()
export const applyForces = (
  graph: Graph,
  oldArrangement: Arrangement,
  opts?: ComputeForcesOpts
): Arrangement => {
  const { threshold, coolingFactor, ignore } = {
    ...defaultComputeForcesOpts,
    ...opts,
  };

  let maxForce = 0;
  const vertices = Object.values(graph.vertices);
  const arrangement: Arrangement = { ...oldArrangement };
  const forces: Record<string, Vec2> = {};

  for (const vertex of vertices) {
    if (ignore.has(vertex.id)) {
      forces[vertex.id] = new Vec2([0, 0]);
      continue;
    }

    const repulsiveForce = computeRepulsiveForce(vertex, vertices, arrangement);
    const attractiveForce = computeAttractiveForce(vertex, graph, arrangement);

    forces[vertex.id] = new Vec2([0, 0])
      .add(repulsiveForce)
      .add(attractiveForce);

    const force = forces[vertex.id].len();

    if (force > maxForce) {
      maxForce = force;
    }
  }

  if (maxForce < threshold) {
    return arrangement;
  }

  for (const vertex of vertices) {
    const finalForce = forces[vertex.id].multiply(coolingFactor);
    arrangement[vertex.id].add(finalForce);
  }

  return arrangement;
};
