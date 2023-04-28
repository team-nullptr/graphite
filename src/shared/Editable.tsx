import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

export interface EditableProps {
  value: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export const Editable = (props: EditableProps) => {
  const [value, setValue] = useState(props.value);
  const active = useRef<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    active.current = true;
    setValue(event.target.value);
  };

  const inputBlurHandler = () => {
    if (active.current) {
      props.onChange?.(value);
    }
  };

  const inputTypeHandler = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      props.onChange?.(value);
      active.current = false;
      ref.current?.blur();
    } else if (event.key === "Escape") {
      setValue(props.value);
      active.current = false;
      ref.current?.blur();
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      placeholder={props.placeholder}
      className={props.className}
      onBlur={inputBlurHandler}
      onChange={inputChangeHandler}
      onKeyDown={inputTypeHandler}
      disabled={props.disabled}
    />
  );
};
