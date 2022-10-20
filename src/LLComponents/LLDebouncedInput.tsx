import { useEffect, useMemo, useRef, useState } from "react";

import { debounce } from "lodash";

const LLDebouncedInput = ({
  type,
  value,
  onChange,
  placeholder,
  autoFocus,
  focus,
  twStyle,
}: {
  type: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  focus?: boolean;
  twStyle?: string;
}) => {
  const [optimisticValue, setOptimisticValue] = useState<string>(value);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOptimisticValue(value);
  }, [value]);

  useEffect(() => {
    if (focus && input.current) return input.current.focus();
  }, [focus]);

  const debouncedOnChange = useMemo(
    () =>
      debounce(
        (value: string, onChangeFx: (value: string) => void) =>
          onChangeFx(value),
        300
      ),
    []
  );

  return (
    <input
      ref={input}
      className={`${twStyle} p-2 border-b-2 border-gray-500 hover:border-cyan-300 focus:outline-none focus:border-cyan-300`}
      type={type}
      placeholder={placeholder}
      value={optimisticValue}
      onChange={(event) => {
        setOptimisticValue(event.target.value);
        debouncedOnChange(event.target.value, onChange);
      }}
      autoFocus={autoFocus}
    />
  );
};

export default LLDebouncedInput;
