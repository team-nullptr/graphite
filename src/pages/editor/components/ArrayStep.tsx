import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ArrayState } from "~/core/simulator/state";
import { cn } from "~/lib/utils";
import { useHorizontalScroll } from "~/shared/hooks/useHorizontalScroll";

export type ArrayStepProps = {
  state: ArrayState;
  visibleCells?: number;
};

export function ArrayStep({ state, visibleCells = 8 }: ArrayStepProps) {
  //TODO: Remove controlls whenever they are useless

  const scrollRef = useHorizontalScroll();

  const scrollLeft = () => {
    const el = scrollRef.current;

    if (!el) return;

    el.scrollTo({
      left: el.scrollLeft - 180,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      left: el.scrollLeft + 180,
      behavior: "smooth",
    });
  };

  const isRecomendedAmount = visibleCells <= 8;

  return (
    <div className="space-y-4 p-4">
      <span className="font-md text-slate-800">{state.title}</span>
      <div className="flex items-center gap-2">
        {!isRecomendedAmount && (
          <ChevronLeftIcon
            onClick={scrollLeft}
            className="w-6 min-w-[25px] cursor-pointer text-slate-600 opacity-80 hover:opacity-100"
          />
        )}
        <div
          ref={scrollRef}
          className="scroll flex snap-x snap-proximity gap-1 overflow-x-scroll scroll-smooth whitespace-nowrap scrollbar-hide"
        >
          {Array.from({ length: visibleCells }).map((_, i) => {
            const element = state.data[i];

            return (
              <div
                key={`step-${i}`}
                className={cn(
                  "flex aspect-square w-12 min-w-[38px] items-center justify-center border border-slate-300",
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
        {!isRecomendedAmount && (
          <ChevronRightIcon
            onClick={scrollRight}
            className="w-6 min-w-[25px] cursor-pointer text-slate-600 opacity-80 hover:opacity-100"
          />
        )}
      </div>
    </div>
  );
}
