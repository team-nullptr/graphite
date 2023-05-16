export interface AlgorithmTileProps {
  name: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const AlgorithmTile = (props: AlgorithmTileProps) => {
  return (
    <button onClick={() => props.onClick?.()} disabled={props.disabled}>
      {props.name}
    </button>
  );
};
