import { useEffect, useMemo, useState } from "react";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { distributeEdges, groupEdges, sortEdges } from "./util/distributeEdges";
import { useEditorStore } from "../editor/context/editor";
import { Highlights } from "../../engine/runner/instruction";
import { forceArrange, randomArrange } from "./force-arrangement";
import { Vec2d } from "./vec2d";

type Arrangement = Record<string, Vec2d>;

export type GraphViewProps = {
  highlights?: Highlights;
};

export const GraphView = (props: GraphViewProps) => {
  const graph = useEditorStore((state) => state.graph);

  const [arrangement, setArrangement] = useState<Arrangement>(
    randomArrange(graph)
  );

  useEffect(() => {
    window.addEventListener("keyup", (e) => {
      if (e.code === "Backquote") {
        setArrangement(randomArrange(graph));
      }
    });
  }, []);

  const update = () => {
    setArrangement((a) => forceArrange(graph, { ...a }));
  };

  useEffect(() => {
    setArrangement(randomArrange(graph));

    const id = setInterval(() => update(), 10);

    return () => clearInterval(id);
  }, [graph]);

  const positionedEdges = useMemo(() => {
    const connections = groupEdges(Object.values(graph.edges));

    return connections.map((connection) => {
      const [vertex, edges] = connection;
      const sortedEdges = sortEdges(edges, vertex);
      return distributeEdges(sortedEdges, vertex);
    });
  }, [graph]);

  const view = useMemo(() => {
    return (
      <>
        {Object.values(graph.vertices).map((vertex) => {
          const { x, y } = arrangement[vertex.id] ?? new Vec2d([0, 0]);
          const { id } = vertex;
          const hue = props.highlights?.get(id);

          return (
            <Vertex
              hue={hue}
              key={id}
              cx={x * 5}
              cy={y * 5}
              value={id}
              onMouseDown={(offset) => console.log(offset)}
            />
          );
        })}
        {positionedEdges.flat().map((positionedEdge) => {
          const [edge, position] = positionedEdge;
          const { x, y } = arrangement[edge.from] ?? new Vec2d([0, 0]);
          const { x: dx, y: dy } = arrangement[edge.to] ?? new Vec2d([0, 0]);
          const circular = edge.from === edge.to;

          return (
            <Edge
              key={edge.id}
              position={position}
              x={x * 5}
              y={y * 5}
              dx={dx * 5}
              dy={dy * 5}
              directed={edge.directed}
              circular={circular}
            />
          );
        })}
      </>
    );
  }, [arrangement]);

  return (
    <svg
      // ref={svgRef}
      className="h-full w-full bg-base-200 dark:bg-base-300-dark"
    >
      {view}
    </svg>
  );
};
