import { useEffect, useState } from "react";

import { LocationData } from "../API/LocationProvider";
import LLDebouncedAutoResizeTextarea from "../LLComponents/LLDebouncedAutoResizeTextarea";
import LLDebouncedInput from "../LLComponents/LLDebouncedInput";

const Location = ({
  data,
  onModify,
  active,
  customButtonStatus,
}: {
  data: LocationData;
  onModify: (value: object) => void;
  active: boolean;
  customButtonStatus: boolean;
}) => {
  const [isPlaces, setIsPlaces] = useState<boolean>(customButtonStatus);

  const handleModify = (properties: object) => {
    onModify({ ...structuredClone(data), ...properties });
  };

  useEffect(() => {
    if (customButtonStatus) {
      if (!data.places) handleModify({ places: [""] });
      setIsPlaces(true);
    } else {
      if (data.places) handleModify({ places: null });
      setIsPlaces(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customButtonStatus]);

  return (
    <div className="flex flex-col flex-nowrap justify-center items-center space-y-4">
      <LLDebouncedInput
        type="text"
        value={data.location}
        onChange={(value) => handleModify({ location: value })}
        placeholder="Location"
        focus={active && data.location === ""}
        twStyle="text-base"
      />
      {isPlaces && data.places && (
        <LLDebouncedAutoResizeTextarea
          value={data.places}
          onChange={(value: string[]) => handleModify({ places: value })}
          placeholder="Places"
          focus={
            active &&
            (!data.places ||
              data.places.length === 0 ||
              (data.places.length === 1 && !data.places[0]))
          }
        />
      )}
    </div>
  );
};

export default Location;
