import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathRoundedSquareIcon,
  StopIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useState, useCallback, useEffect, HTMLAttributes } from "react";
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

export const Player = ({
  currentStep,
  numberOfSteps,
  onStepChange,
  settings,
  className,
}: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const restartHandler = () => {
    setIsPlaying(false);
    onStepChange(0);
  };

  const previousStepHandler = () => {
    const value = Math.max(currentStep - 1, 0);
    onStepChange(value);
  };

  const nextStepHandler = useCallback(() => {
    const value = Math.min(currentStep + 1, numberOfSteps - 1);
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
        onClick={previousStepHandler}
        disabled={currentStep === 0}
        icon={<ArrowLeftIcon className="h-5 w-5" />}
        alt="previous"
      />

      <ControlsButton
        onClick={nextStepHandler}
        disabled={currentStep === numberOfSteps - 1}
        icon={<ArrowRightIcon className="h-5 w-5" />}
        alt="next"
      />

      <ControlsButton
        onClick={restartHandler}
        icon={<ArrowPathRoundedSquareIcon className="h-5 w-5" />}
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
