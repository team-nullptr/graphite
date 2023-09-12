import {
  ArrowRightIcon,
  StopIcon,
  PlayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useState, useCallback, useEffect } from "react";
import { Controls, ControlsButton } from "~/shared/Controls";

export type PlayerSettings = {
  speed: number;
};

export type PlayerProps = {
  currentStep: number;
  numberOfSteps: number;
  onStepChange: (step: number) => void;
  settings: PlayerSettings;
  className?: string;
};

export function Player({
  currentStep,
  numberOfSteps,
  onStepChange,
  settings,
  className,
}: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const firstStepHandler = () => {
    setIsPlaying(false);
    onStepChange(0);
  };

  const lastStepHandler = () => {
    setIsPlaying(false);
    onStepChange(numberOfSteps);
  };

  const previousStepHandler = () => {
    const value = Math.max(currentStep - 1, 0);
    onStepChange(value);
  };

  const nextStepHandler = useCallback(() => {
    const value = Math.min(currentStep + 1, numberOfSteps);
    onStepChange(value);
  }, [currentStep, numberOfSteps, onStepChange]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = setInterval(() => {
      nextStepHandler();
    }, settings.speed);

    return () => clearInterval(intervalId);
  }, [settings, isPlaying, nextStepHandler]);

  return (
    <Controls className={className}>
      <ControlsButton
        onClick={firstStepHandler}
        disabled={currentStep === 0}
        icon={<ChevronDoubleLeftIcon className="h-5 w-5" />}
        alt="first"
      />

      <ControlsButton
        onClick={previousStepHandler}
        disabled={currentStep === 0}
        icon={<ArrowLeftIcon className="h-5 w-5" />}
        alt="previous"
      />

      <ControlsButton
        onClick={nextStepHandler}
        disabled={currentStep === numberOfSteps}
        icon={<ArrowRightIcon className="h-5 w-5" />}
        alt="next"
      />

      <ControlsButton
        onClick={lastStepHandler}
        disabled={currentStep === numberOfSteps}
        icon={<ChevronDoubleRightIcon className="h-5 w-5" />}
        alt="last"
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
}
