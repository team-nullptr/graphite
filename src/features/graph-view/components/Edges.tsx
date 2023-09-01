import { Edge as EdgeType } from "~/core/simulator/graph";
import { PositionedEdge } from "../helpers/distributeEdges";
import { Arrangement } from "../types/arrangement";
import { Vec2 } from "../types/vec2";
import { Edge } from "./Edge";
import { useMemo } from "react";
import { Highlights } from "~/core/simulator/algorithm";
import { Color } from "~/types/color";

const centerPosition = new Vec2(0, 0);

export type EdgesProps = {
  positionedEdges: PositionedEdge[];
  arrangement: Arrangement;
  highlights?: Highlights;
};

export function Edges({ positionedEdges, arrangement, highlights }: EdgesProps) {
  const renderedEdges = useMemo(() => {
    return positionedEdges.map((positionedEdge) => {
      const [edge, positionIndex] = positionedEdge;
      const color = highlights?.get(edge.id);
      const { x: fromX, y: fromY } = arrangement[edge.from] ?? centerPosition;
      const { x: toX, y: toY } = arrangement[edge.to] ?? centerPosition;
      const isCircular = edge.from === edge.to;

      return (
        <Edge
          key={edge.id}
          x={fromX}
          y={fromY}
          dx={toX}
          dy={toY}
          directed={edge.directed}
          position={positionIndex}
          circular={isCircular}
          color={color}
          thicken={!!color}
        />
      );
    });
  }, [positionedEdges, arrangement, highlights]);

  return <>{renderedEdges}</>;
}
