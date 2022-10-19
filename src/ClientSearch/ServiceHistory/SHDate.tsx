import { useEffect, useState } from "react";

const SHDate = ({
  defaultValue,
  disabled,
}: {
  defaultValue: string;
  disabled: boolean;
}) => {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  if (disabled) return <p className="whitespace-nowrap">{value}</p>;

  return (
    <input
      type="date"
      className="bg-white border rounded-lg border-gray-800 p-1"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    ></input>
  );
};

export default SHDate;
