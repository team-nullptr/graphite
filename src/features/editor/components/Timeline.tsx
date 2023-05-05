import { ChangeEvent } from "react";

import { Controls, ControlsButton } from "../../../shared/Controls";
import styles from "./Timeline.module.css";

import {
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export interface TimelineProps {
  playing: boolean;
  currentStep: number;
  stepCount: number;
  onStepChange?: (step: number) => void;
  onStop?: () => void;
  onStart?: () => void;
}

export const Timeline = (props: TimelineProps) => {
  const sliderChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    props.onStepChange?.(parseInt(value));
  };

  const startHandler = () => props.onStart?.();
  const stopHandler = () => props.onStop?.();
  const restartHandler = () => props.onStepChange?.(1);

  const previousStepHandler = () => {
    const value = Math.max(props.currentStep - 1, 1);
    props.onStepChange?.(value);
  };

  const nextStepHandler = () => {
    const value = Math.min(props.currentStep + 1, props.stepCount);
    props.onStepChange?.(value);
  };

  return (
    <Controls>
      {props.playing ? (
        <ControlsButton
          onClick={stopHandler}
          icon={<StopIcon className="h-5 w-5" />}
          alt="stop"
        />
      ) : (
        <ControlsButton
          onClick={startHandler}
          icon={<PlayIcon className="h-5 w-5" />}
          alt="play"
        />
      )}

      <ControlsButton
        onClick={restartHandler}
        icon={<ArrowPathIcon className="h-5 w-5" />}
        alt="restart"
      />

      <ControlsButton
        onClick={previousStepHandler}
        disabled={props.currentStep === 1}
        icon={<ArrowLeftIcon className="h-5 w-5" />}
        alt="previous"
      />

      <ControlsButton
        onClick={nextStepHandler}
        disabled={props.currentStep === props.stepCount}
        icon={<ArrowRightIcon className="h-5 w-5" />}
        alt="next"
      />

      <input
        className={styles.slider}
        type="range"
        min="1"
        max={props.stepCount}
        value={props.currentStep}
        onChange={sliderChangeHandler}
      />
    </Controls>
  );
};
