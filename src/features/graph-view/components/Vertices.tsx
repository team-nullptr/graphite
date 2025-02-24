import { Vertex as VertexType } from "~/core/simulator/graph";
import { Vertex } from "./Vertex";
import { Arrangement } from "../types/arrangement";
import { Vec2 } from "../types/vec2";
import { useCallback, useMemo } from "react";
import { Highlights } from "~/core/simulator/highlight";
import { Labels } from "~/core/simulator/step";

const LEFT_MOUSE_BUTTON = 0;
const centerPosition = new Vec2(0, 0);

export type VerticesProps = {
  vertices: VertexType[];
  labels: Labels;
  highlights?: Highlights;
  arrangement: Arrangement;
  onVertexMouseDown?: (vertexId: string, event: MouseEvent) => void;
};

export function Vertices({
  labels,
  vertices,
  highlights,
  arrangement,
  onVertexMouseDown,
}: VerticesProps) {
  const vertexMouseDownHandler = useCallback(
    (vertexId: string, event: MouseEvent) => {
      if (event.button === LEFT_MOUSE_BUTTON) {
        onVertexMouseDown?.(vertexId, event);
      }
    },
    [onVertexMouseDown]
  );

  const renderedVertices = useMemo(() => {
    return vertices.map((vertex) => {
      const vertexId = vertex.id;
      const { x, y } = arrangement[vertexId] ?? centerPosition;
      const color = highlights?.get(vertexId);
      const label = labels.get(vertexId);

      return (
        <Vertex
          key={vertexId}
          cx={x}
          cy={y}
          value={vertexId}
          label={label}
          color={color}
          onMouseDown={(event) => {
            vertexMouseDownHandler(vertexId, event);
          }}
        />
      );
    });
  }, [labels, vertices, highlights, arrangement, vertexMouseDownHandler]);

  return <>{renderedVertices}</>;
}
