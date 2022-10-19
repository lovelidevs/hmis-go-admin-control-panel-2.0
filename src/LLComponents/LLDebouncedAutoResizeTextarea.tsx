import { useEffect, useMemo, useRef, useState } from "react";

import { debounce } from "lodash";

const LLDebouncedAutoResizeTextarea = ({
  value,
  onChange,
  placeholder,
  cols,
  autoFocus,
  twStyle,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  cols?: number;
  autoFocus?: boolean;
  twStyle?: string;
}) => {
  const [optimisticValue, setOptimisticValue] = useState<string>(
    value.join("\n")
  );

  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setOptimisticValue(value.join("\n"));
  }, [value]);

  useEffect(() => {
    if (!textarea.current) return;

    textarea.current.style.height = "0px";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  });

  const debouncedOnChange = useMemo(
    () =>
      debounce(
        (value: string, onChangeFx: (value: string[]) => void) =>
          onChangeFx(value.split(/\r?\n/)),
        300
      ),
    []
  );

  return (
    <textarea
      ref={textarea}
      className={`${twStyle} resize-none bg-white px-4 py-2 outline-none border-l-2 border-gray-500 hover:border-cyan-300 focus:border-cyan-300 focus:outline-none`}
      placeholder={placeholder}
      value={optimisticValue}
      onChange={(event) => {
        setOptimisticValue(event.target.value);
        debouncedOnChange(event.target.value, onChange);
      }}
      cols={cols}
      autoFocus={autoFocus}
    />
  );
};

export default LLDebouncedAutoResizeTextarea;
