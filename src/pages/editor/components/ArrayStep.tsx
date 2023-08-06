import { ArrayState } from "~/core/simulator/algorithm";
import { cn } from "~/lib/utils";

export type ArrayStepProps = {
  state: ArrayState;
  visibleCells?: number;
};

export const ArrayStep = ({ state, visibleCells = 8 }: ArrayStepProps) => {
  console.log(state);

  return (
    <div className="p-4 space-y-4">
      <span className="text-slate-800 font-md">{state.title}</span>
      <div className="flex gap-1">
        {/* TODO: Do not use index as a key. */}
        {Array.from({ length: visibleCells }).map((_, i) => {
          const element = state.data[i];

          return (
            <div
              key={i}
              className={cn(
                "flex items-center w-12 justify-center border border-slate-300 aspect-square",
                element ? "bg-slate-100" : "bg-slate-50",
                state.highlighted.has(i) &&
                  "bg-sky-300 animate-pulse border ring-1 ring-sky-400 border-sky-400"
              )}
            >
              {element ?? null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
