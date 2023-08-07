import { MutableRefObject, Ref } from "react";

export function combineRefs<T extends unknown>(...refs: Ref<T>[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && "current" in ref) {
        (ref as MutableRefObject<T>).current = node;
      }
    }
  };
}
