import { useContext, useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";
import omitDeep from "omit-deep-lodash";

import {
  LOAD_LOCATION_DOCUMENT,
  LocationContext,
  LocationData,
  LocationDocument,
  UPDATE_LOCATION_DOCUMENT,
} from "../../API/LocationProvider";
import DraggableList from "../../DraggableList/DraggableList";
import Location from "../../DraggableList/Location";
import LLAutosaveStatusBar from "../../LLComponents/LLAutosaveStatusBar";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";

const LocationEditor = (): JSX.Element => {
  const locationContext = useContext(LocationContext);

  const { loading, error, data, refetch } = useQuery(LOAD_LOCATION_DOCUMENT, {
    variables: { _id: locationContext?.locationDocumentId },
  });

  useEffect(() => {
    if (locationContext?.locationDocumentId) refetch();
  }, [locationContext?.locationDocumentId, refetch]);

  const [mutationFx, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_LOCATION_DOCUMENT);

  const updateFx = (dataClone: LocationDocument) => {
    mutationFx({
      variables: {
        _id: dataClone._id,
        location: omitDeep(dataClone, ["__typename"]),
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneLocation: dataClone,
      },
    });
  };

  const renderFx = (
    data: LocationData,
    onModify: (value: object) => void,
    active: boolean,
    customButtonStatus?: boolean
  ): JSX.Element => {
    return (
      <Location
        data={data}
        onModify={onModify}
        active={active}
        customButtonStatus={customButtonStatus ? customButtonStatus : false}
      />
    );
  };

  const initIsPlaces = (data: LocationData, nestLevel: number): boolean => {
    if (nestLevel > 0) return false;

    if (!data.places || data.places.length === 0) return false;
    if (data.places.length === 1 && data.places[0] === "") return false;

    return true;
  };

  if (!locationContext?.locationDocumentId) return <LLLoadingSpinner />;

  if (loading || error) {
    if (error) {
      console.log("Error loading location document:");
      console.log(error);
    }

    return <LLLoadingSpinner />;
  }

  if (!data.location)
    return (
      <main className="w-full h-full flex flex-col flex-nowrap justify-center items-center">
        <p>NO DATA</p>
      </main>
    );

  return (
    <main className="flex flex-col flex-nowrap justify-start items-center space-y-4 my-4">
      <LLAutosaveStatusBar
        updateLoading={updateLoading}
        updateError={updateError}
      />
      <DraggableList
        data={data.location}
        nestLevels={2}
        dataPropNames={["location", "category", "city"]}
        arrayPropNames={["locations", "categories", "cities"]}
        newDataFxs={[
          locationContext.newLocationData,
          locationContext.newLocationCategoryData,
          locationContext.newLocationCityData,
        ]}
        updateFx={updateFx}
        renderFx={renderFx}
        customButtonStatusInitFx={initIsPlaces}
        customButton={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="hover:stroke-cyan-300 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
        customButtonYesNoQuestion={
          "Are you sure you want to delete these places?"
        }
      />
    </main>
  );
};

export default LocationEditor;
