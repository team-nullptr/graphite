import { Graph } from "~/core/simulator/graph";
import { ControlledSvg } from "~/features/graph-view/components/controlled-svg/ControlledSvg";
import { Edges } from "./components/Edges";
import { Vertices } from "./components/Vertices";
import { distributeEdges, groupEdges, sortEdges } from "./helpers/distributeEdges";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { useRef, useMemo } from "react";
import { Toolbar } from "./components/Toolbar";
import { Highlights } from "~/core/simulator/highlight";
import { Labels } from "~/core/simulator/step";

export type GraphViewProps = {
  labels: Labels;
  verticesHighlights?: Highlights;
  edgesHighlights?: Highlights;
  graph: Graph;
};

export function GraphView({ labels, verticesHighlights, edgesHighlights, graph }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // prettier-ignore
  const { arrangement, vertexMouseDownHandler, areControlsEnabled, isForceLayoutEnabled, setIsForceLayoutEnabled } =
    useGraphLayout(graph, svgRef);

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

  return (
    <ControlledSvg
      isPanEnabled={areControlsEnabled}
      zoomBounds={{ min: 0.5, max: 2 }}
      ref={svgRef}
      className="h-full w-full"
      controls={({ zoom, setZoom, setCenter }) => (
        <Toolbar
          zoom={zoom}
          isForceLayoutEnabled={isForceLayoutEnabled}
          onForceLayoutToggle={() => setIsForceLayoutEnabled(!isForceLayoutEnabled)}
          onZoomReset={() => setZoom(1)}
          onZoomIncrease={() => {
            setZoom(zoom + 0.1);
          }}
          onZoomDecrease={() => {
            setZoom(zoom - 0.1);
          }}
          onCenter={() => {
            setCenter([0, 0]);
          }}
        />
      )}
    >
      <defs>
        <radialGradient id="edgeLabelGradient">
          <stop offset="0%" stopColor="#f9fafb" stopOpacity={1} />
          <stop offset="100%" stopColor="#f9fafb" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Edges
        positionedEdges={positionedEdges}
        highlights={edgesHighlights}
        arrangement={arrangement}
      />
      <Vertices
        vertices={Object.values(graph.vertices)}
        labels={labels}
        highlights={verticesHighlights}
        arrangement={arrangement}
        onVertexMouseDown={vertexMouseDownHandler}
      />
    </ControlledSvg>
  );
}
