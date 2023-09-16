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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const firstStepHandler = () => {
    setIsAutoPlaying(false);
    onStepChange(0);
  };

  const lastStepHandler = () => {
    setIsAutoPlaying(false);
    onStepChange(numberOfSteps);
  };

  const previousStepHandler = () => {
    const value = Math.max(currentStep - 1, 0);
    onStepChange(value);
  };

  const previousStepClickHandler = () => {
    setIsAutoPlaying(false);
    previousStepHandler();
  };

  const nextStepHandler = useCallback(() => {
    const value = Math.min(currentStep + 1, numberOfSteps);
    onStepChange(value);
  }, [currentStep, numberOfSteps, onStepChange]);

  const nextStepClickHandler = () => {
    setIsAutoPlaying(false);
    nextStepHandler();
  };

  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const intervalId = setInterval(() => {
      nextStepHandler();
    }, settings.speed);

    return () => clearInterval(intervalId);
  }, [settings, isAutoPlaying, nextStepHandler]);

  return (
    <Controls className={className}>
      <ControlsButton
        onClick={firstStepHandler}
        disabled={currentStep === 0}
        icon={<ChevronDoubleLeftIcon className="h-5 w-5" />}
        alt="first step"
      />

      <ControlsButton
        onClick={previousStepClickHandler}
        disabled={currentStep === 0}
        icon={<ArrowLeftIcon className="h-5 w-5" />}
        alt="previous step"
      />

      <ControlsButton
        onClick={nextStepClickHandler}
        disabled={currentStep === numberOfSteps}
        icon={<ArrowRightIcon className="h-5 w-5" />}
        alt="next step"
      />

      <ControlsButton
        onClick={lastStepHandler}
        disabled={currentStep === numberOfSteps}
        icon={<ChevronDoubleRightIcon className="h-5 w-5" />}
        alt="last step"
      />

      {isAutoPlaying ? (
        <ControlsButton
          onClick={() => setIsAutoPlaying(false)}
          icon={<StopIcon className="h-5 w-5" />}
          alt="stop autoplay"
        />
      ) : (
        <ControlsButton
          onClick={() => setIsAutoPlaying(true)}
          icon={<PlayIcon className="h-5 w-5" />}
          alt="autoplay"
        />
      )}
    </Controls>
  );
}
