import { ServiceData } from "../API/ServiceProvider";
import LLDebouncedAutoResizeTextarea from "../LLComponents/LLDebouncedAutoResizeTextarea";
import LLDebouncedInput from "../LLComponents/LLDebouncedInput";
import LLSelect from "../LLComponents/LLSelect";

const Service = ({
  data,
  onModify,
  active,
}: {
  data: ServiceData;
  onModify: (value: object) => void;
  active: boolean;
}) => {
  const handleModify = (properties: object) => {
    onModify({ ...structuredClone(data), ...properties });
  };

  return (
    <div className="flex flex-col flex-nowrap justify-center items-center space-y-4">
      <div className="flex flex-row flex-nowrap justify-center items-stretch space-x-4">
        <LLDebouncedInput
          type="text"
          value={data.service}
          onChange={(value) => handleModify({ service: value })}
          placeholder="Service"
          focus={active && data.service === ""}
          twStyle="text-base"
        />
        <LLSelect
          value={data.inputType}
          onChange={(value) => handleModify({ inputType: value })}
          options={["Toggle", "Counter", "Textbox", "Locations", "Custom List"]}
        />
      </div>
      {data.inputType === "Counter" && (
        <LLDebouncedInput
          type="text"
          value={data.units ? data.units : ""}
          onChange={(value) => handleModify({ units: value })}
          placeholder="units"
          focus={active && (!data.units || data.units === "")}
          twStyle="text-base"
        />
      )}
      {data.inputType === "Custom List" && (
        <LLDebouncedAutoResizeTextarea
          value={data.customList ? data.customList : [""]}
          onChange={(value: string[]) => handleModify({ customList: value })}
          placeholder="Custom List"
          focus={
            active &&
            (!data.customList ||
              data.customList.length === 0 ||
              (data.customList.length === 1 && !data.customList[0]))
          }
        />
      )}
    </div>
  );
};

export default Service;
