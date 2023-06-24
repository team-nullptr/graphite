import { useRef } from "react";
import { useResizeObserver } from "./hooks/useResizeObserver";

export interface GraphViewProps {
  className: string;
}

export const GraphView = (props: GraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rect = useResizeObserver(containerRef);

  return (
    <div ref={containerRef} className={props.className}>
      <svg className="h-full w-full" />
    </div>
  );
};
