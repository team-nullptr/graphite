import { ReactNode } from "react";
import styles from "./SpaceshipButton.module.css";

type SpaceshipButtonProps = {
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick: () => void;
};

// This component is heavily inspired (in fact almost copied) from https://wope.com
export const SpaceshipButton = ({
  label,
  icon,
  disabled = false,
  onClick,
}: SpaceshipButtonProps) => {
  return (
    <div className="pointer-events-none relative isolate overflow-hidden rounded-lg">
      {!disabled && (
        <>
          {/* Shiny Border */}
          <div
            className={`pointer-events-none absolute -z-10 h-full w-full overflow-hidden rounded-lg p-[2px] ${styles.swoosh_mask}`}
          >
            <div
              className={`absolute left-1/2 top-1/2 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2 bg-cover ${styles.swoosh}`}
            />
          </div>

          {/* Glow */}
          <div
            className={`pointer-events-none absolute -z-10 h-full w-full overflow-hidden rounded-lg blur-lg`}
          >
            <div
              className={`absolute left-1/2 top-1/2 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-cover ${styles.glow}`}
            />
          </div>
        </>
      )}

      {/* Button */}
      <button
        disabled={disabled}
        className={`pointer-events-auto flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 text-slate-800 transition-all ease-out enabled:hover:bg-slate-800 enabled:hover:text-white disabled:bg-slate-300 disabled:opacity-60 disabled:shadow-sm`}
        onClick={onClick}
      >
        {icon} {label}
      </button>
    </div>
  );
};
