import { Player, PlayerSettings } from "./Player";
import { Timeline } from "./Timeline";

export type AlgorithmControlsProps = {
  currentStep: number;
  numberOfSteps: number;
  onStepChange: (step: number) => void;
  playerSettings: PlayerSettings;
};

export const AlgorithmControls = ({
  currentStep,
  numberOfSteps,
  onStepChange,
  playerSettings,
}: AlgorithmControlsProps) => {
  return (
    <div>
      <Player
        currentStep={currentStep}
        numberOfSteps={numberOfSteps}
        onStepChange={onStepChange}
        settings={playerSettings}
        className="border-b border-slate-300"
      />
      <Timeline
        currentStep={currentStep}
        numberOfSteps={numberOfSteps}
        onStepChange={onStepChange}
      />
    </div>
  );
};
