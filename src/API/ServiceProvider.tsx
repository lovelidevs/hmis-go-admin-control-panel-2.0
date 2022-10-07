import React, { ReactNode, useContext, useEffect, useState } from "react";

import { ObjectId } from "bson";
import gql from "graphql-tag";

import { AuthContext } from "../Authentication/AuthProvider";

const LOAD_SERVICE_DOCUMENT_ID = gql``;

type ServiceDocument = {
  __typename?: string;
  _id: ObjectId;
  organization: string;
  categories: ServiceCategoryData[];
};

type ServiceCategoryData = {
  __typename?: string;
  uuid: string;
  category: string;
  services: ServiceData[];
};

type ServiceData = {
  __typename?: string;
  uuid: string;
  service: string;
  inputType: string;
  units?: string;
  customList?: string[];
};

type ServiceContextType = {
  serviceDocumentId: ObjectId | null;
  updateServices: (serviceDocument: ServiceDocument) => void;
};

export const ServiceContext = React.createContext<ServiceContextType | null>(
  null
);

const ServiceProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const authContext = useContext(AuthContext);

  const [serviceDocumentId, setServiceDocumentId] = useState<ObjectId | null>(
    null
  );

  useEffect(() => {
    if (!authContext?.user) return setServiceDocumentId(null);
    if (!authContext.userData?.organization) return setServiceDocumentId(null);

    // TODO: lazyQuery for a serviceDocument (make sure no infinite loop), only load the _id and store it in a state variable
  }, [authContext?.user]);

  // TODO: useEffect() if there is no servicedocument yet for this org, make it! That's what the insert is gfor

  // TODO: Make a new demo environment, demo2

  const updateServices = (serviceDocument: ServiceDocument) => {
    // TODO
  };

  return (
    <ServiceContext.Provider value={{ serviceDocumentId, updateServices }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
