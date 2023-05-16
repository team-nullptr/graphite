import { Algorithm } from "../models/Algorithm";

export interface AlgorithmDetails {
  algorithm: Algorithm;
  onBackClick?: () => void;
  /** Determines if the start visualization button is locked or not */
  invalid?: boolean;
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
