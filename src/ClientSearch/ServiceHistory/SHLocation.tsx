import { useContext, useEffect, useRef, useState } from "react";

import { LocationContext, LocationDocument } from "../../API/LocationProvider";
import LLButton from "../../LLComponents/LLButton";
import LLLegendSelect from "../../LLComponents/LLLegendSelect";

const SHLocation = ({
  locationDocument,
  defaultCity,
  defaultLocationCategory,
  defaultLocation,
  disabled,
}: {
  locationDocument: LocationDocument;
  defaultCity: string;
  defaultLocationCategory: string;
  defaultLocation: string;
  disabled: boolean;
}) => {
  const locationContext = useContext(LocationContext);

  const [city, setCity] = useState<string>(defaultCity);

  const [locationCategory, setLocationCategory] = useState<string>(
    defaultLocationCategory
  );

  const [location, setLocation] = useState<string>(defaultLocation);

  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setCity(defaultCity);
    setLocationCategory(defaultLocationCategory);
    setLocation(defaultLocation);
  }, [defaultCity, defaultLocationCategory, defaultLocation]);

  const handleChangeCity = (value: string) => {
    setCity(value);
    setLocationCategory("");
    setLocation("");
  };

  const handleChangeLocationCategory = (value: string) => {
    setLocationCategory(value);
    setLocation("");
  };

  const handleChangeLocation = (value: string) => {
    setLocation(value);
  };

  if (!locationContext) return <p>Loading...</p>;

  if (disabled)
    return (
      <p className={"text-center whitespace-nowrap"}>
        {location ? location : "-"}
      </p>
    );

  return (
    <>
      <p
        className={
          "text-center bg-white hover:cursor-pointer border border-gray-800 rounded-lg p-1"
        }
        data-city={city}
        data-locationcategory={locationCategory}
        data-location={location}
        onClick={() => {
          if (!dialog.current?.open) dialog.current?.showModal();
        }}
      >
        {location ? location : "-"}
      </p>
      <dialog ref={dialog} className="rounded-lg">
        <form
          method="dialog"
          className="flex flex-col flex-nowrap justify-start items-center space-y-4"
        >
          <h3 className="text-xl text-black text-bold">Location Select</h3>
          <LLLegendSelect
            legend={"City"}
            value={city}
            onChange={handleChangeCity}
            options={[...locationContext.getCities(locationDocument), ""]}
          />
          <LLLegendSelect
            legend={"Location Category"}
            value={locationCategory}
            onChange={handleChangeLocationCategory}
            options={[
              ...locationContext.getLocationCategories(locationDocument, city),
              "",
            ]}
          />
          <LLLegendSelect
            legend={"Location"}
            value={location}
            onChange={handleChangeLocation}
            options={[
              ...locationContext.getLocations(
                locationDocument,
                city,
                locationCategory
              ),
              "",
            ]}
          />
          <LLButton type="submit">Close</LLButton>
        </form>
      </dialog>
    </>
  );
};

export default SHLocation;
