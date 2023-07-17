import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BottomPane } from "~/shared/layout/BottomPane";
import { useEditorStore } from "../context/editor";
import { GraphView } from "../features/graph-view/GraphView";
import { StepStateTable } from "./StepStateTable";
import { Timeline } from "./Timeline";
import { createPortal } from "react-dom";

type TooltipProps = {
  label: string;
  elementRef: RefObject<HTMLElement>;
};

const Tooltip = ({ elementRef, label }: TooltipProps) => {
  if (!elementRef.current) return null;

  const tooltipRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      ref={tooltipRef}
      className="absolute -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-slate-800 px-2 py-1 text-slate-200"
      style={{
        left: "50%",
        top: "-32px",
      }}
    >
      <span className="absolute -bottom-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-800" />
      <div className="flex text-xs">step {label}</div>
    </div>,
    elementRef.current
  );
};

type StepBrickProps = {
  step: number;
  current: boolean;
  onClick: () => void;
  scale: boolean;
  mouseX: number;
};

const zoomWidth = 100;

const StepBrick = ({
  step,
  current,
  onClick,
  scale,
  mouseX,
}: StepBrickProps) => {
  const brickRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const [showTooltip, setShowTooltip] = useState(false);
  const [padding, setPadding] = useState(0);

  const animate = useCallback(() => {
    if (!brickRef.current) return;

    const { left, width } = brickRef.current.getBoundingClientRect();
    const distance = Math.abs(mouseX - (left + width / 2));

    const maxPadding = zoomWidth - width;

    const targetPadding = Math.min(
      maxPadding,
      scale
        ? Math.max(
            0,
            maxPadding -
              (showTooltip
                ? distance > zoomWidth / 3
                  ? 0
                  : distance
                : distance + 60)
          )
        : 0
    );

    const diff = (targetPadding - padding) / 10;
    setPadding((padding) => padding + diff);

    animationRef.current = requestAnimationFrame(animate);
  }, [padding, mouseX]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <>
      {showTooltip && <Tooltip elementRef={brickRef} label={`${step + 1}`} />}
      <div
        ref={brickRef}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative box-content h-full flex-grow ${
          current ? "bg-slate-800" : "bg-slate-50"
        }`}
        style={{
          paddingLeft: `${padding}px`,
        }}
      />
    </>
  );
};

type StepBarProps = {
  stepsCount: number;
  currentStep: number;
  onStepClick: (step: number) => void;
};

const StepBar = ({ stepsCount, currentStep, onStepClick }: StepBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [scale, setScale] = useState(false);

  useLayoutEffect(() => {
    if (!barRef.current) return;

    const updateMouse = (e: MouseEvent) => setMouseX(e.clientX);
    window.addEventListener("mousemove", updateMouse);

    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  return (
    <div
      ref={barRef}
      className="flex h-4 w-full divide-x divide-slate-300 border-b border-slate-300"
      onMouseEnter={() => setScale(true)}
      onMouseLeave={() => setScale(false)}
    >
      {Array.from({ length: stepsCount }).map((_, i) => (
        <StepBrick
          key={i}
          step={i}
          current={i === currentStep}
          onClick={() => onStepClick(i)}
          scale={scale}
          mouseX={mouseX}
        />
      ))}
    </div>
  );
};

export const Visualizer = () => {
  const visualizerRef = useRef(null);

  const [currentStepIndex, setCurrentStep] = useState(0);

  const { mode, graph } = useEditorStore(({ mode, graph }) => ({
    mode,
    graph,
  }));

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [mode]);

  const highlights =
    mode.mode === "SIMULATION"
      ? mode.steps[currentStepIndex].highlights
      : undefined;

  return (
    <div className="relative flex h-full w-full flex-col" ref={visualizerRef}>
      <GraphView
        graph={graph}
        className="h-full w-full"
        highlights={highlights}
      />

      {mode.mode === "SIMULATION" && (
        <BottomPane className="flex flex-col" parentRef={visualizerRef}>
          <Timeline
            currentStep={currentStepIndex}
            onStepChange={setCurrentStep}
            maxStep={mode.steps.length - 1}
          />
          <StepBar
            stepsCount={mode.steps.length}
            currentStep={currentStepIndex}
            onStepClick={setCurrentStep}
          />
          <div className="flex-shrink flex-grow-0 basis-auto">
            <div className="bg-base-200 flex h-full w-full flex-col gap-4 p-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800">
                  Step {currentStepIndex + 1} / {mode.steps.length}:
                </span>
                <p className="text-slate-800">
                  {mode.steps[currentStepIndex].description}
                </p>
              </div>
              {/* <StepStateTable state={mode.steps[currentStepIndex].state} /> */}
            </div>
          </div>
        </BottomPane>
      )}
    </div>
  );
};
