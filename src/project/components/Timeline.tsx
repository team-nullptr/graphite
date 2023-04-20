import { ChangeEvent } from "react";

import { Controls } from "../../core/components/Controls";
import styles from "./Timeline.module.css";

import BackIcon from "../../assets/arrow_back_FILL0_wght200_GRAD0_opsz24.svg";
import ForwardIcon from "../../assets/arrow_forward_FILL0_wght200_GRAD0_opsz24.svg";
import PlayIcon from "../../assets/play_arrow_FILL0_wght100_GRAD0_opsz24.svg";
import RestartIcon from "../../assets/replay_FILL0_wght200_GRAD0_opsz24.svg";
import StopIcon from "../../assets/stop_FILL0_wght100_GRAD0_opsz24.svg";

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
    <Controls className={styles.container}>
      <ul className={styles["timeline-controls"]}>
        <li>
          {props.playing ? (
            <button onClick={stopHandler}>
              <img
                src={StopIcon}
                alt="stop"
                style={{ width: 29, height: 29 }}
              />
            </button>
          ) : (
            <button onClick={startHandler}>
              <img
                src={PlayIcon}
                alt="play"
                style={{ width: 29, height: 29 }}
              />
            </button>
          )}
        </li>
        <li>
          <button onClick={restartHandler}>
            <img src={RestartIcon} alt="restart" style={{ width: 19 }} />
          </button>
        </li>
        <li>
          <button
            onClick={previousStepHandler}
            disabled={props.currentStep === 1}
          >
            <img src={BackIcon} alt="previous" />
          </button>
        </li>
        <li>
          <button
            onClick={nextStepHandler}
            disabled={props.currentStep === props.stepCount}
          >
            <img src={ForwardIcon} alt="next" />
          </button>
        </li>
      </ul>
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
