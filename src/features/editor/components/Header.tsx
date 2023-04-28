import { Controls } from "../../../shared/Controls";
import { Editable } from "../../../shared/Editable";
import styles from "./Header.module.css";

import BackIcon from "../../../assets/arrow_back_FILL0_wght200_GRAD0_opsz24.svg";

export interface HeaderProps {
  name: string;
  onNavigateUp?: () => void;
  onRename?: (projectName: string) => void;
  disabled?: boolean;
}

export const Header = (props: HeaderProps) => {
  const navigateBackHandler = () => {
    props.onNavigateUp?.();
  };

  const editableChangeHandler = (name: string) => {
    props.onRename?.(name);
  };

  return (
    <Controls className={styles.header}>
      <button onClick={navigateBackHandler}>
        <img src={BackIcon} alt="back to project list" />
      </button>
      <Editable
        className={styles.input}
        placeholder="Project"
        value={props.name}
        onChange={editableChangeHandler}
        disabled={props.disabled}
      />
    </Controls>
  );
};
