import { useEffect, useState } from "react";

import dayjs from "dayjs";

const SHTime = ({
  defaultValue,
  disabled,
}: {
  defaultValue: string;
  disabled: boolean;
}) => {
  const [value, setValue] = useState<string>(
    dayjs(defaultValue).local().format("HH:mm")
  );

  useEffect(() => {
    setValue(dayjs(defaultValue).local().format("HH:mm"));
  }, [defaultValue]);

  if (disabled) return <p className="whitespace-nowrap">{value}</p>;

  return (
    <input
      type="time"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    ></input>
  );
};

export default SHTime;
