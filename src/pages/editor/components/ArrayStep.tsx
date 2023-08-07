import { ArrayState } from "~/core/simulator/algorithm";
import { cn } from "~/lib/utils";

export type ArrayStepProps = {
  state: ArrayState;
  visibleCells?: number;
};

export function ArrayStep({ state, visibleCells = 8 }: ArrayStepProps) {
  return (
    <div className="space-y-4 p-4">
      <span className="font-md text-slate-800">{state.title}</span>
      <div className="flex gap-1">
        {/* TODO: Do not use index as a key. */}
        {Array.from({ length: visibleCells }).map((_, i) => {
          const element = state.data[i];

          return (
            <div
              key={i}
              className={cn(
                "flex aspect-square w-12 items-center justify-center border border-slate-300",
                element ? "bg-slate-100" : "bg-slate-50",
                state.highlighted.has(i) &&
                  "animate-pulse border border-sky-400 bg-sky-300 ring-1 ring-sky-400"
              )}
            >
              {element ?? null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
