import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Orientation } from "~/shared/layout/useSplit";

interface LayoutSettings {
  orientation: Orientation;
  switchOrientation: () => void;
}

const orientationsChange = {
  vertical: "horizontal",
  horizontal: "vertical",
} as const;

export const useLayoutSettingsStore = create<LayoutSettings>()(
  devtools(
    persist(
      (set) => ({
        orientation: "vertical",
        switchOrientation: () =>
          set((state) => ({
            orientation: orientationsChange[state.orientation],
          })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
