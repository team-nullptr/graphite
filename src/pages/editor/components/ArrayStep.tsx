import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { ArrayState } from "~/core/simulator/state";
import { cn } from "~/lib/utils";

const useHorizontalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;

    if (!scroll) {
      return;
    }

    scroll.addEventListener("wheel", (e) => {
      e.preventDefault();
      scroll.scrollLeft += e.deltaY;
    });
  }, [scrollRef]);

  const scrollRight = () => {
    const scroll = scrollRef.current;

    if (!scroll) {
      return;
    }

    scroll.scrollBy({
      left: 48,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    const scroll = scrollRef.current;

    if (!scroll) {
      return;
    }

    scroll.scrollBy({
      left: -48,
      behavior: "smooth",
    });
  };

  return {
    scrollRef,
    scrollRight,
    scrollLeft,
  };
};

export const ArrayItemSkeleton = () => (
  <div className="flex aspect-square w-12 min-w-[48px] items-center justify-center border border-slate-300" />
);

type ArrayItemProps = {
  element: string;
  highlight: boolean;
};

export const ArrayItem = ({ element, highlight = false }: ArrayItemProps) => {
  return (
    <div
      className={cn(
        "flex aspect-square w-12 min-w-[48px] items-center justify-center border border-slate-300 bg-slate-100",
        highlight && "animate-pulse border border-sky-400 bg-sky-300 ring-1 ring-sky-400"
      )}
    >
      {element ?? null}
    </div>
  );
};

export type ArrayStepProps = {
  state: ArrayState;
  visibleCells?: number;
};

export function ArrayStep({ state, visibleCells = 8 }: ArrayStepProps) {
  const { scrollRef, scrollLeft, scrollRight } = useHorizontalScroll();

  return (
    <div className="space-y-4 p-4">
      <span className="font-md text-slate-800">{state.title}</span>
      <div ref={scrollRef} className="no-scrollbar flex gap-1 overflow-x-scroll whitespace-nowrap">
        {Array.from({ length: visibleCells }).map((_, i) => {
          const element = state.data[i];

          return element ? (
            <ArrayItem key={i} element={element} highlight={state.highlighted.has(i)} />
          ) : (
            <ArrayItemSkeleton key={i} />
          );
        })}
      </div>
      <div className="flex justify-between">
        <button className="border border-slate-300 bg-slate-100 px-4 py-1" onClick={scrollLeft}>
          <ArrowLeftIcon className="w-4" />
        </button>
        <button className="border border-slate-300 bg-slate-100 px-4 py-1" onClick={scrollRight}>
          <ArrowRightIcon className="w-4" />
        </button>
      </div>
    </div>
  );
}
