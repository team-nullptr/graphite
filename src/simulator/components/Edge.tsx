import styles from "./Edge.module.css";

const vertexRadius = 19;

export interface EdgeProps {
  x: number;
  y: number;
  dx: number;
  dy: number;
  directed?: boolean;
}

export const Edge = (props: EdgeProps) => {
  const width = props.dx - props.x;
  const height = props.dy - props.y;

  const rad = Math.atan2(height, width);
  const deg = (rad * 180) / Math.PI + 180;

  const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

  const offsetX = (vertexRadius * width) / length;
  const offsetY = (vertexRadius * height) / length;

  const path = props.directed
    ? getArrowPath(length - 2 * vertexRadius)
    : getLinePath(length - 2 * vertexRadius);

  // prettier-ignore
  const transform = `translate(${props.dx - offsetX} ${props.dy - offsetY}) rotate(${deg})`;

  return <path className={styles.edge} d={path} transform={transform} />;
};

const getArrowPath = (length: number): string => {
  // prettier-ignore
  return `M6.02565 6.05129L0 0.0256458L6.02565 -6L6.62021 -5.41025L1.60098 -0.391021H${length}V0.442312H1.60098L6.62021 5.46154L6.02565 6.05129Z`;
};

const getLinePath = (length: number): string => {
  return `M0 -0.391021H${length}V0.442312H0Z`;
};
