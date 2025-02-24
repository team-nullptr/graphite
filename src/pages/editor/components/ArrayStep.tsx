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
  className?: string;
  element?: string;
  highlight?: boolean;
};

export const ArrayItem = ({ className, element, highlight = false }: ArrayItemProps) => {
  return (
    <div
      className={cn(
        "flex  aspect-square w-12 min-w-[48px] items-center justify-center border  border-slate-300 bg-slate-100",
        highlight && "animate-bounce",
        className
      )}
    >
      {element}
    </div>
  );
};

export type ArrayStepProps = {
  state: ArrayState;
};

export function ArrayStep({ state }: ArrayStepProps) {
  const { scrollRef, scrollLeft, scrollRight } = useHorizontalScroll();

  return (
    <div className="space-y-4 p-4">
      <div className="no-scrollbar space-y-4 overflow-x-scroll" ref={scrollRef}>
        <span className="font-md sticky left-0 z-10 text-slate-800">{state.title}</span>
        <div className="flex gap-1  whitespace-nowrap">
          {state.data.length > 0 ? (
            state.data.map((element, i) => {
              return <ArrayItem key={i} element={element} highlight={state.highlighted.has(i)} />;
            })
          ) : (
            <ArrayItem className="opacity-0" />
          )}
        </div>
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
