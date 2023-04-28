import { useEffect, useMemo, useRef, useState } from "react";
import { Vertex as IVertex } from "../engine/graph";
import styles from "./Simulator.module.css";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { Position } from "./model/position";
import {
  PositionedEdge,
  distributeEdges,
  groupEdges,
  sortEdges,
} from "./util/distributeEdges";
import { useProjectStore } from "../store/project";

export type Arrangement = { [key: string]: Position };

type SelectedVertex = {
  id: string;
  offset: Position;
};

export interface SimulatorProps {
  onRearrange?: (newArrangement: Arrangement) => void;
}

export const Simulator = (props: SimulatorProps) => {
  const [arrangement, setArrangement] = useState({});
  const selectedVertex = useRef<SelectedVertex>();
  const svgRef = useRef<SVGSVGElement>(null);
  const graph = useProjectStore((store) => store.graph);

  const positionedEdges = useMemo(() => {
    const connections = groupEdges(graph.edges);

    return connections.map((connection) => {
      const [vertex, edges] = connection;
      const sortedEdges = sortEdges(edges, vertex);
      return distributeEdges(sortedEdges, vertex);
    });
  }, [graph]);

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      const boundingBox = svgRef.current?.getBoundingClientRect();
      if (!boundingBox) return;

      const vertex = selectedVertex.current;
      if (!vertex) return;

      const [ox, oy] = vertex.offset;
      const x = event.clientX - boundingBox.left - ox;
      const y = event.clientY - boundingBox.top - oy;

      setArrangement((arrangement) => {
        return { ...arrangement, [vertex.id]: [x, y] };
      });
    };

    const mouseUpHandler = () => {
      selectedVertex.current = undefined;
    };

    addEventListener("mousemove", mouseMoveHandler);
    addEventListener("mouseup", mouseUpHandler);

    return () => {
      removeEventListener("mousemove", mouseMoveHandler);
      removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  const vertexMouseDownHandler = (vertex: IVertex, offset: Position) => {
    selectedVertex.current = { id: vertex.id, offset };
  };

  return (
    <svg ref={svgRef} className={styles.simulator}>
      {/* prettier-ignore */}
      <Edges
        edges={positionedEdges.flat()}
        arrangement={arrangement}
      />
      <Vertices
        vertices={graph.vertices}
        arrangement={arrangement}
        onMouseDown={vertexMouseDownHandler}
      />
    </svg>
  );
};

interface VerticesProps {
  vertices: IVertex[];
  arrangement: Arrangement;
  onMouseDown: (vertex: IVertex, offset: Position) => void;
}

const Vertices = (props: VerticesProps) => {
  const renderedVertices = props.vertices.map((vertex) => {
    const [x, y] = props.arrangement[vertex.id] ?? [0, 0];
    const { id, value } = vertex;
    return (
      <Vertex
        key={id}
        cx={x}
        cy={y}
        value={value as any}
        onMouseDown={(offset) => props.onMouseDown(vertex, offset)}
      />
    );
  });

  return <>{renderedVertices}</>;
};

interface EdgesProps {
  edges: PositionedEdge[];
  arrangement: Arrangement;
}

const Edges = (props: EdgesProps) => {
  const renderedEdges = props.edges.map((positionedEdge) => {
    const [edge, position] = positionedEdge;
    const [x, y] = props.arrangement[edge.from.id] ?? [0, 0];
    const [dx, dy] = props.arrangement[edge.to.id] ?? [0, 0];
    const circular = edge.from.id === edge.to.id;

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
  });

  return <>{renderedEdges}</>;
};
