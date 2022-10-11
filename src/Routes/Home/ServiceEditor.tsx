import { useContext } from "react";

import { useQuery } from "@apollo/client";

import {
  LOAD_SERVICE_DOCUMENT,
  ServiceContext,
  ServiceDocument,
} from "../../API/ServiceProvider";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";

const ServiceEditor = (): JSX.Element => {
  const serviceContext = useContext(ServiceContext);

  const { loading, error, data } = useQuery(LOAD_SERVICE_DOCUMENT, {
    variables: { _id: serviceContext?.serviceDocumentId },
  });

  const handleModify = (value: object, modifyIndexes: number[]) => {
    const serviceDocumentClone = structuredClone(
      data.service
    ) as ServiceDocument;
  };

  const modifyNestedArray = (array, value, modifyIndexes);

  const handleChange = (updatedData: object, modifyIndexes: number[]) => {
    const dataClone: QueryData = structuredClone(data);
    const dataArray = dataClone[gqlObjectName][
      gqlChildArrayFields[nestLevels]
    ] as object[];

    changeHandlerHelper(
      dataArray,
      updatedData,
      modifyIndexes,
      gqlChildArrayFields,
      nestLevels
    );

    update(dataClone);
  };

  const changeHandlerHelper = (
    dArr: any,
    uData: object,
    mIdxs: number[],
    cArrFlds: string[],
    nL: number
  ) => {
    switch (mIdxs.length) {
      case 1:
        dArr[mIdxs[0]] = uData;
        break;
      case 2:
        dArr[mIdxs[1]][cArrFlds[nL - 1]][mIdxs[0]] = uData;
        break;
      case 3:
        dArr[mIdxs[2]][cArrFlds[nL - 1]][mIdxs[1]][cArrFlds[nL - 2]][mIdxs[0]] =
          uData;
        break;
    }
  };

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

  return <div>{String(data.service)}</div>;
};

export default ServiceEditor;
