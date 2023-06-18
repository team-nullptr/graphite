import { useCallback, useEffect, useRef, useState } from "react";
import { Graph } from "../../../engine/runner/graph";
import { Vec2 } from "../model/vec2";

type Arrangement = Record<string, Vec2>;

// TODO: Temporary (not working as good as I would like)
const preArrange = (graph: Graph) =>
  Object.values(graph.vertices).reduce((arrangement, v, i) => {
    arrangement[v.id] = new Vec2([100 + 100 * i, 100 + 100 * i]);
    return arrangement;
  }, {} as Arrangement);

/** Force that pushes vertices away from other vertices. */
const repulsiveForce = (source: Vec2, adj: Vec2): Vec2 => {
  const force = adj
    .vecTo(source)
    .multiply(
      10 / Math.pow(Math.E, 0.2 * source.distanceTo(adj)) +
        0.5 / Math.pow(source.distanceTo(adj), 2)
    );

  return force;
};

/** Force that pushes vertices to adjacent vertices. */
const attractiveForce = (source: Vec2, adj: Vec2): Vec2 => {
  const spring = 0.2;
  const springLength = 100;

  const springForce = source
    .vecTo(adj)
    .multiply(spring * Math.log(adj.distanceTo(source) / springLength));

  return springForce;
};

type ApplyForcesOpts = {
  threshold: number;
  coolingFactor: number;
};

const defaultApplyForcesOpts: ApplyForcesOpts = {
  threshold: 0.1,
  coolingFactor: 0.995,
};

/**
 * Applies forces to vertices.
 * I don't really know how to control speed of animation.
 * This function is called each frame, and everytime it's called vertices are
 * moved a bit closer to the "optimal state".
 */
const applyForces = (
  graph: Graph,
  oldArrangement: Arrangement,
  opts?: ApplyForcesOpts
): Arrangement => {
  const { threshold, coolingFactor } = {
    ...defaultApplyForcesOpts,
    ...opts,
  };

  const arrangement: Arrangement = { ...oldArrangement };
  const forces: Record<string, Vec2> = {};
  const vertices = Object.keys(graph.vertices);

  for (const vertexId of vertices) {
    const vertex = graph.vertices[vertexId];

    // repulsive force
    const finalRepulsiveforce = new Vec2([0, 0]);

    for (const targetVertexId of vertices) {
      if (vertexId === targetVertexId) {
        continue;
      }

      finalRepulsiveforce.add(
        repulsiveForce(arrangement[vertexId], arrangement[targetVertexId])
      );
    }

    // attractive force
    const finalAttractiveForce = new Vec2([0, 0]);

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

    forces[vertexId] = new Vec2([0, 0])
      .add(finalAttractiveForce)
      .add(finalRepulsiveforce);
  }

  const maxForce = Math.max(
    ...Object.values(forces).map((force) => force.len())
  );

  // We want to stop applying forces when the force length
  // is smaller then chosen threshold.
  if (maxForce < threshold) {
    return arrangement;
  }

  for (const vertexId of vertices) {
    const finalForce = forces[vertexId].multiply(coolingFactor);
    arrangement[vertexId].add(finalForce);
  }

  return arrangement;
};

type SelectedVertex = {
  id: string;
  offset: Vec2;
};

export const useForceDirectedLayout = (graph: Graph) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedVertexRef = useRef<SelectedVertex>();
  const requestRef = useRef<number>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  // Vertex dragging

  const vertexMouseDownHandler = (id: string, offset: Vec2) => {
    selectedVertexRef.current = { id, offset };
  };

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      const boundingBox = svgRef.current?.getBoundingClientRect();

      if (!boundingBox) {
        return;
      }

      if (!selectedVertexRef.current) {
        return;
      }

      const {
        id,
        offset: { x: ox, y: oy },
      } = selectedVertexRef.current;
      const x = event.clientX - boundingBox.left - ox;
      const y = event.clientY - boundingBox.top - oy;

      setArrangment((arrangement) => {
        return {
          ...arrangement,
          [id]: new Vec2([x, y]),
        };
      });
    };

    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
    };

    addEventListener("mousemove", mouseMoveHandler);
    addEventListener("mouseup", mouseUpHandler);

    return () => {
      removeEventListener("mousemove", mouseMoveHandler);
      removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  // Simulation

  // TODO: We don't want to rearrange vertices that were already arranged.
  // We need to arrange only newly added vertices.
  useEffect(() => {
    setArrangment(preArrange(graph));
  }, [graph]);

  const runSimulation: FrameRequestCallback = useCallback(() => {
    setArrangment((current) => applyForces(graph, current));
    requestRef.current = requestAnimationFrame(runSimulation);
  }, [graph]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(runSimulation);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [runSimulation]);

  return {
    arrangement,
    vertexMouseDownHandler,
    svgRef,
    selectedVertexRef,
  };
};
