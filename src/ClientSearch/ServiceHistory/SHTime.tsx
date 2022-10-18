import { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const SHTime = ({
  defaultValue,
  disabled,
}: {
  defaultValue: string;
  disabled: boolean;
}) => {
  const convertDefaultValue = useCallback((value: string) => {
    if (!value) return "";
    else return dayjs(value).local().format("HH:mm");
  }, []);

  const [value, setValue] = useState<string>(convertDefaultValue(defaultValue));

  useEffect(() => {
    setValue(convertDefaultValue(defaultValue));
  }, [defaultValue, convertDefaultValue]);

  if (disabled) {
    console.log(value);
    return (
      <p className="whitespace-nowrap">
        {value ? dayjs(value, "HH:mm").format("h:mm A") : "-"}
      </p>
    );
  }

  return (
    <input
      type="time"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    ></input>
  );
};

export default SHTime;
