import { Vertex as VertexType } from "~/core/simulator/graph";
import { Vertex } from "./Vertex";
import { Arrangement } from "../types/arrangement";
import { Vec2 } from "../types/vec2";
import { useCallback, useMemo } from "react";
import { Highlights } from "~/core/simulator/algorithm";

const LEFT_MOUSE_BUTTON = 0;
const centerPosition = new Vec2(0, 0);

export type VerticesProps = {
  vertices: VertexType[];
  highlights?: Highlights;
  arrangement: Arrangement;
  onVertexMouseDown?: (vertexId: string, event: MouseEvent) => void;
};

export function Vertices({ vertices, highlights, arrangement, onVertexMouseDown }: VerticesProps) {
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

      return (
        <Vertex
          key={vertexId}
          cx={x}
          cy={y}
          value={vertexId}
          color={color}
          onMouseDown={(event) => {
            vertexMouseDownHandler(vertexId, event);
          }}
        />
      );
    });
  }, [vertices, highlights, arrangement, vertexMouseDownHandler]);

  return <>{renderedVertices}</>;
}
