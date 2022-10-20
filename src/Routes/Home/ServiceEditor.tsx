import { useContext, useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";
import omitDeep from "omit-deep-lodash";

import {
  LOAD_SERVICE_DOCUMENT,
  ServiceContext,
  ServiceData,
  ServiceDocument,
  UPDATE_SERVICE_DOCUMENT,
} from "../../API/ServiceProvider";
import DraggableList from "../../DraggableList/DraggableList";
import Service from "../../DraggableList/Service";
import LLAutosaveStatusBar from "../../LLComponents/LLAutosaveStatusBar";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";

const ServiceEditor = (): JSX.Element => {
  const serviceContext = useContext(ServiceContext);

  const { loading, error, data, refetch } = useQuery(LOAD_SERVICE_DOCUMENT, {
    variables: { _id: serviceContext?.serviceDocumentId },
  });

  useEffect(() => {
    if (serviceContext?.serviceDocumentId) refetch();
  }, [serviceContext?.serviceDocumentId, refetch]);

  const [mutationFx, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_SERVICE_DOCUMENT);

  const updateFx = (dataClone: ServiceDocument) => {
    mutationFx({
      variables: {
        _id: dataClone._id,
        service: omitDeep(dataClone, ["__typename"]),
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneService: dataClone,
      },
    });
  };

  const renderFx = (
    data: ServiceData,
    onModify: (value: object) => void,
    active: boolean
  ): JSX.Element => {
    return <Service data={data} onModify={onModify} active={active} />;
  };

  if (!serviceContext?.serviceDocumentId) return <LLLoadingSpinner />;

  if (loading || error) {
    if (error) {
      console.log("Error loading service document:");
      console.log(error);
    }

    return <LLLoadingSpinner />;
  }

  if (!data.service)
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
        data={data.service}
        nestLevels={1}
        dataPropNames={["service", "category"]}
        arrayPropNames={["services", "categories"]}
        newDataFxs={[
          serviceContext.newServiceData,
          serviceContext.newServiceCategoryData,
        ]}
        updateFx={updateFx}
        renderFx={renderFx}
      />
    </main>
  );
};

export default ServiceEditor;
