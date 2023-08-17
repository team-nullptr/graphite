import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Orientation } from "~/shared/layout/useSplit";

export type LayoutSettings = {
  orientation: Orientation;
  switchOrientation: () => void;
};

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
        name: "layout-settings",
      }
    )
  )
);
