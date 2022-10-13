import { useEffect, useMemo, useState } from "react";

import { debounce } from "lodash";

const LLDebouncedInput = ({
  type,
  value,
  onChange,
  placeholder,
  twStyle,
}: {
  type: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  twStyle?: string;
}) => {
  const [optimisticValue, setOptimisticValue] = useState<string>(value);

  useEffect(() => {
    setOptimisticValue(value);
  }, [value]);

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
      className={`${twStyle} p-2 border-b-2 border-gray-500 hover:border-cyan-300 focus:outline-none focus:border-cyan-300`}
      type={type}
      placeholder={placeholder}
      value={optimisticValue}
      onChange={(event) => {
        setOptimisticValue(event.target.value);
        debouncedOnChange(event.target.value, onChange);
      }}
    />
  );
};

export default LLDebouncedInput;
