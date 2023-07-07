import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { Controls, ControlsButton } from "../../../shared/Controls";

export interface TimelineProps {
  currentStep: number;
  maxStep: number;
  onStepChange?: (step: number) => void;
}

export const Timeline = ({
  currentStep,
  maxStep,
  onStepChange,
}: TimelineProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const restartHandler = () => {
    setIsPlaying(false);
    onStepChange?.(0);
  };

  const previousStepHandler = () => {
    const value = Math.max(currentStep - 1, 0);
    onStepChange?.(value);
  };

  const nextStepHandler = useCallback(() => {
    const value = Math.min(currentStep + 1, maxStep);
    onStepChange?.(value);
  }, [currentStep, maxStep, onStepChange]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = setInterval(() => {
      nextStepHandler();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, nextStepHandler]);

  // const sliderChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   onStepChange?.(parseInt(value));
  // };

  return (
    <Controls>
      <ControlsButton
        onClick={previousStepHandler}
        disabled={currentStep === 0}
        icon={<ArrowLeftIcon className="h-5 w-5" />}
        alt="previous"
      />

      <ControlsButton
        onClick={nextStepHandler}
        disabled={currentStep === maxStep}
        icon={<ArrowRightIcon className="h-5 w-5" />}
        alt="next"
      />

      {/* TODO: Maybe we can make something better than built-in slider */}
      {/* 
      <input
        className={styles.slider}
        type="range"
        min="0"
        max={maxStep}
        value={currentStep}
        onChange={sliderChangeHandler}
      /> */}

      <ControlsButton
        onClick={restartHandler}
        icon={<ArrowPathIcon className="h-5 w-5" />}
        alt="restart"
      />

      {isPlaying ? (
        <ControlsButton
          onClick={() => setIsPlaying(false)}
          icon={<StopIcon className="h-5 w-5" />}
          alt="stop"
        />
      ) : (
        <ControlsButton
          onClick={() => setIsPlaying(true)}
          icon={<PlayIcon className="h-5 w-5" />}
          alt="play"
        />
      )}
    </Controls>
  );
};
