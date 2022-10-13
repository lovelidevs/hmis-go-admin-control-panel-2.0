import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import { ObjectId } from "bson";
import gql from "graphql-tag";
import { v4 as uuidv4 } from "uuid";

import { AuthContext } from "../Authentication/AuthProvider";
import { ApolloClientContext } from "./ApolloClientProvider";

const LOAD_SERVICE_DOCUMENT_ID = gql`
  query LoadServiceDocumentId($organization: String!) {
    service(query: { organization: $organization }) {
      _id
    }
  }
`;

const INSERT_SERVICE_DOCUMENT = gql`
  mutation InsertServiceDocument($service: ServiceInsertInput!) {
    insertOneService(data: $service) {
      _id
    }
  }
`;

const serviceFragment = gql`
  fragment Service_service on Service {
    _id
    categories {
      uuid
      category
      services {
        uuid
        service
        inputType
        units
        customList
      }
    }
  }
`;

export const LOAD_SERVICE_DOCUMENT = gql`
  query LoadServiceDocument($_id: ObjectId!) {
    service(query: { _id: $_id }) {
      ...Service_service
    }
  }
  ${serviceFragment}
`;

export const UPDATE_SERVICE_DOCUMENT = gql`
  mutation UpdateServiceDocument(
    $_id: ObjectId!
    $service: ServiceUpdateInput!
  ) {
    updateOneService(query: { _id: $_id }, set: $service) {
      ...Service_service
    }
  }
  ${serviceFragment}
`;

export type ServiceDocument = {
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

export type ServiceData = {
  __typename?: string;
  uuid: string;
  service: string;
  inputType: "Toggle" | "Counter" | "Textbox" | "Locations" | "Custom List";
  units?: string;
  customList?: string[];
};

type ServiceContextType = {
  serviceDocumentId: ObjectId | null;
  newServiceData: () => ServiceData;
  newServiceCategoryData: () => ServiceCategoryData;
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
  const apolloClientContext = useContext(ApolloClientContext);

  const [serviceDocumentId, setServiceDocumentId] = useState<ObjectId | null>(
    null
  );

  const [loadServiceDocumentId] = useLazyQuery(LOAD_SERVICE_DOCUMENT_ID);
  const [insertServiceDocument] = useMutation(INSERT_SERVICE_DOCUMENT);

  const newServiceData = useCallback((): ServiceData => {
    return {
      uuid: uuidv4(),
      service: "",
      inputType: "Toggle",
      units: "",
      customList: [],
    };
  }, []);

  const newServiceCategoryData = useCallback((): ServiceCategoryData => {
    return {
      uuid: uuidv4(),
      category: "",
      services: [newServiceData()],
    };
  }, [newServiceData]);

  useEffect(() => {
    if (!authContext?.user) return setServiceDocumentId(null);
    if (!authContext.userData?.organization) return setServiceDocumentId(null);
    if (!apolloClientContext?.client) return setServiceDocumentId(null);

    loadServiceDocumentId({
      variables: { organization: authContext.userData.organization },
      onCompleted: (data) => {
        if (data.service)
          return setServiceDocumentId((data.service as ServiceDocument)._id);

        insertServiceDocument({
          variables: {
            service: {
              organization: authContext.userData?.organization,
              categories: [newServiceCategoryData()],
            },
          },
          onCompleted: (data) =>
            setServiceDocumentId(
              (data.insertOneService as ServiceDocument)._id
            ),
          onError: (error) => {
            console.log("Error inserting service document:");
            console.log(error);
          },
        });
      },
      onError: (error) => {
        console.log("Error loading service document _id:");
        console.log(error);
      },
    });
  }, [
    authContext?.user,
    authContext?.userData?.organization,
    apolloClientContext?.client,
    loadServiceDocumentId,
    insertServiceDocument,
    newServiceCategoryData,
  ]);

  return (
    <ServiceContext.Provider
      value={{
        serviceDocumentId,
        newServiceData,
        newServiceCategoryData,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
