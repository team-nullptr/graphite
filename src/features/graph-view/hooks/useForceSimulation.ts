import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef } from "react";
import { Graph, Vertex } from "~/core/simulator/graph";
import { Arrangement } from "../types/arrangement";
import { SelectedVertex } from "../types/selectedVertex";
import { Vec2 } from "../types/vec2";

type ForceSimulatorSettings = {
  threshold: number;
  coolingFactor: number;
};

type Context = {
  ignore: Set<string>;
};

const defaultForceSimulatorSettings: ForceSimulatorSettings = {
  threshold: 0.15,
  coolingFactor: 0.99,
};

class ForceSimulator {
  settings: ForceSimulatorSettings = defaultForceSimulatorSettings;

  // TODO: These variables could be extracted to some config that is passed to simulator.
  maxForce = 0.5;

  attractiveTargetLength = 100; // Target connection length
  attractiveStrength = 0.025;

  repulsiveStrength = 5;
  repulsiveChillOut = 0.02;

  constructor(settings: Partial<ForceSimulatorSettings> = {}) {
    this.settings = { ...this.settings, ...settings };
  }

  applyForces = (context: Context, graph: Graph, oldArrangement: Arrangement): Arrangement => {
    const { threshold, coolingFactor } = this.settings;
    const { ignore } = context;

    const vertices = Object.values(graph.vertices);
    const arrangement: Arrangement = { ...oldArrangement };
    const forces: Record<string, Vec2> = {};

    let maxForce = 0;

    for (const vertex of vertices) {
      if (ignore.has(vertex.id)) {
        forces[vertex.id] = new Vec2(0, 0);
        continue;
      }

      const repulsiveForce = this.computeRepulsiveForce(vertex, vertices, arrangement);
      const attractiveForce = this.computeAttractiveForce(vertex, graph, arrangement);

      forces[vertex.id] = new Vec2(0, 0).add(repulsiveForce).add(attractiveForce);

      const force = forces[vertex.id].len();
      if (force > maxForce) {
        maxForce = force;
      }

      forces[vertex.id].add(this.boundingCircleForce(arrangement[vertex.id]));
    }

    if (maxForce < threshold) {
      return oldArrangement;
    }

    for (const vertex of vertices) {
      const finalForce = forces[vertex.id].multiply(coolingFactor);
      arrangement[vertex.id].add(finalForce);
    }

    return arrangement;
  };

  computeRepulsiveForce(vertex: Vertex, vertices: Vertex[], arrangement: Arrangement): Vec2 {
    const totalForce = new Vec2(0, 0);

    for (const currentVertex of vertices) {
      if (currentVertex.id === vertex.id) {
        continue;
      }

      const force = this.repulsiveForce(arrangement[vertex.id], arrangement[currentVertex.id]);

      totalForce.add(force);
    }

    return totalForce;
  }

  computeAttractiveForce(vertex: Vertex, graph: Graph, arrangement: Arrangement): Vec2 {
    const processedEdges = new Set<string>();
    const totalForce = new Vec2(0, 0);
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

      const force = this.attractiveForce(arrangement[vertex.id], arrangement[adjacentVertexId]);

      processedEdges.add(edgeId);
      totalForce.add(force);
    }

    return totalForce;
  }

  /** Calculates repulsive force for give vertex. */
  // TODO: adj should be renamed to something else because we calculate repulsive force for every other vertex.
  repulsiveForce(source: Vec2, adj: Vec2): Vec2 {
    const distance = source.distanceTo(adj);

    const force = Math.min(
      this.repulsiveStrength / (1 + Math.pow(Math.E, this.repulsiveChillOut * distance)),
      this.maxForce
    );

    return adj.vecTo(source).multiply(force * 10);
  }

  /** Calculates attractive force between the given vertex and it's adjacent node. */
  attractiveForce(source: Vec2, adj: Vec2): Vec2 {
    const distance = adj.distanceTo(source);

    const force = Math.min(
      this.attractiveStrength * Math.log(distance / this.attractiveTargetLength),
      this.maxForce
    );

    return source.vecTo(adj).multiply(force * 300);
  }

  boundingCircleForce(source: Vec2): Vec2 {
    // TODO: Simplify this
    const distance = source.distanceTo(new Vec2(0, 0));
    const force = Math.min(10 / (1 + Math.pow(Math.E, (1 / 5) * -distance + 8)), 1);
    return source.vecTo(new Vec2(0, 0)).multiply(force);
  }
}

const forceSimulator = new ForceSimulator();

export function useForceSimulation(
  graph: Graph,
  selectedVertexRef: MutableRefObject<SelectedVertex | undefined>,
  setArrangement: Dispatch<SetStateAction<Arrangement>>
) {
  const frameRef = useRef<number>();

  const runSimulation: FrameRequestCallback = useCallback(() => {
    const selectedVertex = selectedVertexRef.current;

    setArrangement((current) => {
      const context: Context = {
        ignore: new Set(selectedVertex ? [selectedVertex.id] : []),
      };

      return forceSimulator.applyForces(context, graph, current);
    });

    frameRef.current = requestAnimationFrame(runSimulation);
  }, [graph, setArrangement, selectedVertexRef]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(runSimulation);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [runSimulation]);
}
