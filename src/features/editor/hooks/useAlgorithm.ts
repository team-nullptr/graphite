import { useEffect, useState } from "react";
import { Instruction } from "../../../engine/instruction";
import { useMemo } from "react";

/** Provides flow for algorithm inspection. */
export const useAlgorithm = (instructions: Instruction[]) => {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  useEffect(() => {
    setCurrentInstructionIndex(0);
  }, [instructions]);

  // TODO: Maybe this don't have to be useMemo.
  // I am not sure if rect will rerender all components using currentIstruction when this won't be wrapped in useMemo.
  const currentInstruction = useMemo(
    () => instructions[currentInstructionIndex],
    [currentInstructionIndex]
  );

  /** Advances to the next instruction. */
  const nextInstruction = () =>
    setCurrentInstructionIndex(
      Math.min(currentInstructionIndex + 1, instructions.length - 1)
    );

  /** Goes back to the previous instruction. */
  const prevInstruction = () =>
    setCurrentInstructionIndex(Math.max(currentInstructionIndex - 1, 0));

  return {
    currentInstruction,
    nextInstruction,
    prevInstruction,
  };
};
