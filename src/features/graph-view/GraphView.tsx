import { useMemo, useRef } from "react";
import { Highlights } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";
import {
  distributeEdges,
  groupEdges,
  sortEdges,
} from "./helpers/distributeEdges";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { ControlledSvg } from "~/shared/layout/controlled-svg/ControlledSvg";
import { Edges } from "./components/Edges";
import { Vertices } from "./components/Vertices";

export type GraphViewProps = {
  highlights?: Highlights;
  graph: Graph;
};

export const GraphView = ({ highlights, graph }: GraphViewProps) => {
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
    <ControlledSvg isPanEnabled={isPanEnabled} ref={svgRef}>
      {/* prettier-ignore */}
      <Edges
        positionedEdges={positionedEdges}
        arrangement={arrangement}
      />
      <Vertices
        vertices={Object.values(graph.vertices)}
        highlights={highlights}
        arrangement={arrangement}
        onVertexMouseDown={vertexMouseDownHandler}
      />
    </ControlledSvg>
  );
};
