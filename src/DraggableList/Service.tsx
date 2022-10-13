import { ServiceData } from "../API/ServiceProvider";
import LLDebouncedAutoResizeTextarea from "../LLComponents/LLDebouncedAutoResizeTextarea";
import LLDebouncedInput from "../LLComponents/LLDebouncedInput";
import LLSelect from "../LLComponents/LLSelect";

const Service = ({
  data,
  onModify,
}: {
  data: ServiceData;
  onModify: (value: object) => void;
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
          onChange={(value) => handleModify({ unites: value })}
          placeholder="units"
          twStyle="text-base"
        />
      )}
      {data.inputType === "Custom List" && (
        <LLDebouncedAutoResizeTextarea
          value={data.customList ? data.customList : [""]}
          onChange={(value: string[]) => handleModify({ customList: value })}
          placeholder="Custom List"
        />
      )}
    </div>
  );
};

export default Service;
