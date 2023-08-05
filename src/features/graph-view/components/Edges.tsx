import { Edge as EdgeType } from "~/core/simulator/graph";
import { PositionedEdge } from "../helpers/distributeEdges";
import { Arrangement } from "../types/arrangement";
import { Vec2 } from "../types/vec2";
import { Edge } from "./Edge";
import { useMemo } from "react";

const centerPosition = new Vec2(0, 0);

export interface EdgesProps {
  positionedEdges: PositionedEdge[];
  arrangement: Arrangement;
}

export const Edges = (props: EdgesProps) => {
  const { positionedEdges, arrangement } = props;

  const renderedEdges = useMemo(() => {
    return positionedEdges.map((positionedEdge) => {
      const [edge, positionIndex] = positionedEdge;
      return (
        <InternalEdgeComponent
          key={edge.id}
          edge={edge}
          positionIndex={positionIndex}
          arrangement={arrangement}
        />
      );
    });
  }, [positionedEdges, arrangement]);

  return <>{renderedEdges}</>;
};

interface InternalEdgeComponentProps {
  edge: EdgeType;
  positionIndex: number;
  arrangement: Arrangement;
}

const InternalEdgeComponent = (props: InternalEdgeComponentProps) => {
  const { edge, arrangement } = props;

  const { x: fromX, y: fromY } = arrangement[edge.from] ?? centerPosition;
  const { x: toX, y: toY } = arrangement[edge.to] ?? centerPosition;
  const isCircular = edge.from === edge.to;

  return (
    <Edge
      x={fromX}
      y={fromY}
      dx={toX}
      dy={toY}
      directed={edge.directed}
      position={props.positionIndex}
      circular={isCircular}
    />
  );
};
