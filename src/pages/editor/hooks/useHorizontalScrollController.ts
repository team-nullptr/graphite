import { RefObject, useEffect, useRef } from "react";

export function useHorizontalScrollController() {
  const elRef: RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    const el = elRef.current;
    console.log(el);
  }, []);
  return elRef;
}
