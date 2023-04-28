import { PropsWithChildren } from "react";
import styles from "./Controls.module.css";

export interface ControlsProps {
  className?: string;
}

export const Controls = (props: PropsWithChildren<ControlsProps>) => {
  return (
    <nav className={`${styles.controls} ${props.className ?? ""}`}>
      {props.children}
    </nav>
  );
};
