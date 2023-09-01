import { Highlights } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";
import { ControlledSvg } from "~/shared/layout/controlled-svg/ControlledSvg";
import { Edges } from "./components/Edges";
import { Vertices } from "./components/Vertices";
import { distributeEdges, groupEdges, sortEdges } from "./helpers/distributeEdges";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { useRef, useMemo } from "react";
import { Toolbar } from "./components/Toolbar";

export type GraphViewProps = {
  verticesHighlights?: Highlights;
  edgesHighlights?: Highlights;
  graph: Graph;
};

export function GraphView({ verticesHighlights, edgesHighlights, graph }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // prettier-ignore
  const { arrangement, vertexMouseDownHandler, areControlsEnabled: isPanEnabled } =
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
      isPanEnabled={isPanEnabled}
      zoomBounds={{ min: 0.5, max: 2 }}
      ref={svgRef}
      className="h-full w-full"
      controls={({ zoom, setZoom, setCenter }) => (
        <Toolbar
          zoom={zoom}
          onZoomReset={() => setZoom(1)}
          onZoomIncrease={() => setZoom(Math.floor((zoom + 0.1) * 10) / 10)}
          onZoomDecrease={() => setZoom(Math.ceil((zoom - 0.1) * 10) / 10)}
          onCenter={() => {
            setCenter([0, 0]);
            console.log("japierdole");
          }}
        />
      )}
    >
      {/* prettier-ignore */}
      <Edges
        positionedEdges={positionedEdges}
        highlights={edgesHighlights}
        arrangement={arrangement}
      />
      <Vertices
        vertices={Object.values(graph.vertices)}
        highlights={verticesHighlights}
        arrangement={arrangement}
        onVertexMouseDown={vertexMouseDownHandler}
      />
    </ControlledSvg>
  );
}
