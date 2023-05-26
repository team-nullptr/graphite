export interface AlgorithmTileProps {
  name: string;
  onClick?: () => void;
}

export const AlgorithmTile = (props: AlgorithmTileProps) => {
  return <button onClick={() => props.onClick?.()}>{props.name}</button>;
};
