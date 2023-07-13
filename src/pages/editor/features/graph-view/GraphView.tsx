import { useEffect, useMemo, useRef, useState } from "react";
import { Highlights } from "../../../../core/simulator/step";
import { useEditorStore } from "../../context/editor";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { usePan } from "./hooks/usePan";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { useZoom } from "./hooks/useZoom";
import {
  distributeEdges,
  groupEdges,
  sortEdges,
} from "./helpers/distributeEdges";

export interface GraphViewProps {
  highlights?: Highlights;
  className: string;
}

type Viewport = [x: number, y: number, width: number, height: number];

export const GraphView = (props: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useResizeObserver(containerRef);

  const [viewport, setViewport] = useState<Viewport>([0, 0, 0, 0]);

  const graph = useEditorStore((state) => state.graph);
  const { arrangement, vertexMouseDownHandler, areControlsEnabled } =
    useGraphLayout(graph, svgRef);

  useEffect(() => {
    if (!containerRect) return;

    const { width, height } = containerRect;
    setViewport([0, 0, width, height]);
  }, [containerRect]);

  const containerDimen = [
    containerRect?.width ?? 0,
    containerRect?.height ?? 0,
  ] satisfies [number, number];

  usePan(svgRef, containerDimen, setViewport, areControlsEnabled);
  useZoom(svgRef, setViewport);

  const positionedEdges = useMemo(
    () =>
      groupEdges(Object.values(graph.edges))
        .map((connection) => {
          const [vertex, edges] = connection;
          const sortedEdges = sortEdges(edges, vertex);
          return distributeEdges(sortedEdges, vertex);
        })
        .flat(),
    [graph]
  );

  const vertices = useMemo(() => {
    return Object.entries(arrangement).map(([id, pos]) => {
      const { x, y } = pos;
      const hue = props.highlights?.get(id);

      return (
        <Vertex
          hue={hue}
          key={id}
          cx={x}
          cy={y}
          value={id}
          onMouseDown={(event) => vertexMouseDownHandler(id, event)}
        />
      );
    });
  }, [arrangement, props.highlights, vertexMouseDownHandler]);

  const edges = useMemo(
    () =>
      positionedEdges.map((positionedEdge) => {
        const [edge, position] = positionedEdge;
        const { x, y } = arrangement[edge.from] ?? { x: 0, y: 0 };
        const { x: dx, y: dy } = arrangement[edge.to] ?? { x: 0, y: 0 };
        const circular = edge.from === edge.to;

        return (
          <Edge
            key={edge.id}
            position={position}
            x={x}
            y={y}
            dx={dx}
            dy={dy}
            directed={edge.directed}
            circular={circular}
          />
        );
      }),
    [arrangement, positionedEdges]
  );

  return (
    <>
      <div
        ref={containerRef}
        className={props.className + " select-none overflow-hidden"}
      >
        <svg
          ref={svgRef}
          className="h-full w-full"
          viewBox={viewport.join(" ")}
        >
          {edges}
          {vertices}
        </svg>
      </div>
    </>
  );
};
