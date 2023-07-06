import { Algorithm } from "../../../types/algorithm";

export interface AlgorithmDetails {
  algorithm: Algorithm;
  onBackClick?: () => void;
}

export const AlgorithmDetails = (props: AlgorithmDetails) => {
  const { algorithm } = props;

  return (
    <>
      <button onClick={() => props.onBackClick?.()}>Back</button>
      <ul>
        <li>Name: {algorithm.name}</li>
      </ul>
    </>
  );
};
