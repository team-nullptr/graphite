import { Player, PlayerSettings } from "./Player";
// import { Timeline } from "./Timeline";

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
    <div className="divide-y-slate-300 divide-y">
      <Player
        currentStep={currentStep}
        numberOfSteps={numberOfSteps}
        onStepChange={onStepChange}
        settings={playerSettings}
      />
      {/* TODO: This is not good enough */}
      {/* <Timeline
        currentStep={currentStep}
        numberOfSteps={numberOfSteps}
        onStepChange={onStepChange}
      /> */}
    </div>
  );
};
