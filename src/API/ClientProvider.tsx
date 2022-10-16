import React, { ReactNode, useCallback, useContext } from "react";

import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import { ObjectId } from "bson";
import gql from "graphql-tag";

import { AuthContext } from "../Authentication/AuthProvider";

const CLIENT_PROFILE_FRAGMENT = gql`
  fragment Client_clientProfile on Client {
    _id
    organization
    lastName
    firstName
    DOB
    alias
    hmisID
  }
`;

const SERVICE_HISTORY_FRAGMENT = gql`
  fragment Client_serviceHistory on Client {
    _id
    organization
    lastName
    firstName
    DOB
    alias
    hmisID
  }
`;

export const CLIENT_SEARCH = gql`
  query ClientSearch($query: String!) {
    search(input: $query) {
      ...Client_clientProfile
    }
  }
  ${CLIENT_PROFILE_FRAGMENT}
`;

const CLIENT_ID = gql`
  query Client($query: ClientQueryInput!) {
    client(query: $query) {
      _id
    }
  }
`;

export const CLIENT = gql`
  query Client($_id: ObjectId!) {
    client(query: { _id: $_id }) {
      ...Client_clientProfile
      ...Client_serviceHistory
    }
  }
  ${CLIENT_PROFILE_FRAGMENT}
  ${SERVICE_HISTORY_FRAGMENT}
`;

const INSERT_CLIENT = gql`
  mutation InsertClient($client: ClientInsertInput!) {
    insertOneClient(data: $client) {
      _id
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($_id: ObjectId!, $client: ClientUpdateInput!) {
    updateOneClient(query: { _id: $_id }, set: $client) {
      ...Client_clientProfile
      ...Client_serviceHistory
    }
  }
  ${CLIENT_PROFILE_FRAGMENT}
  ${SERVICE_HISTORY_FRAGMENT}
`;

export type ClientService = {
  __typename?: string;
  service: string;
  text: string | null;
  count: number | null;
  units: string | null;
  list: string[] | null;
};

export type ClientContact = {
  __typename?: string;
  date: string;
  time: string | null;
  city: string | null;
  locationCategory: string | null;
  location: string | null;
  services: ClientService[] | null;
};

export type Client = {
  __typename?: string;
  _id: ObjectId;
  organization: string;
  lastName: string;
  firstName: string;
  DOB: string | null;
  alias: string | null;
  hmisID: string | null;
  serviceHistory: ClientContact[] | null;
};

type ClientContextType = {
  newClient: () => Client;
  cloneClient: (client: Client) => Client;
  isDuplicate: (client: Client) => Promise<boolean>;
  insertClient: (clientClone: Client) => Promise<void>;
  clientKey: (client: Client) => string;
  clientProfileToString: (client: Client) => string;
};

export const ClientContext = React.createContext<ClientContextType | null>(
  null
);

const ClientProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const authContext = useContext(AuthContext);

  const [clientIdQuery] = useLazyQuery(CLIENT_ID);
  const [insertClientMutation] = useMutation(INSERT_CLIENT);

  const newClient = useCallback((): Client => {
    if (!authContext?.userData?.organization)
      throw new Error("No authorization to create new client");

    return {
      _id: new ObjectId(),
      organization: authContext.userData.organization,
      lastName: "",
      firstName: "",
      DOB: null,
      alias: null,
      hmisID: null,
      serviceHistory: null,
    };
  }, [authContext?.userData?.organization]);

  const cloneClient = useCallback((client: Client): Client => {
    const _id = client._id;

    const clientClone: Client = structuredClone(client);
    clientClone._id = _id;
    return clientClone;
  }, []);

  const isDuplicate = useCallback(
    async (client: Client) => {
      if (client.hmisID) {
        const result = await clientIdQuery({
          variables: {
            query: {
              organization: authContext?.user?.customData.organization,
              hmisID: client.hmisID,
            },
          },
          onError: (error: ApolloError) => {
            throw String(error);
          },
        });

        if (result.data.client) return true;
      }

      if (client.DOB) {
        const result = await clientIdQuery({
          variables: {
            query: {
              organization: authContext?.user?.customData?.organization,
              lastName: client.lastName,
              firstName: client.firstName,
              DOB: client.DOB,
            },
          },
          onError: (error: ApolloError) => {
            throw String(error);
          },
        });

        if (result.data.client) return true;
      }

      return false;
    },
    [authContext?.user?.customData.organization, clientIdQuery]
  );

  const insertClient = useCallback(
    async (clientClone: Client): Promise<void> => {
      if (!clientClone.lastName) throw new Error("Missing last name");
      if (!clientClone.firstName) throw new Error("Missing first name");
      if (await isDuplicate(clientClone)) throw new Error("Duplicate client");

      await insertClientMutation({
        variables: { client: clientClone },
        onError: (error: ApolloError) => {
          throw error;
        },
      });
    },
    [isDuplicate, insertClientMutation]
  );

  const clientKey = (client: Client): string => {
    if (client.hmisID) return client.hmisID;

    let key = client.lastName + client.firstName;
    if (client.DOB) key += client.DOB;
    if (client.alias) key += client.alias;

    return key;
  };

  const clientProfileToString = (client: Client): string => {
    let string = client.lastName + " " + client.firstName;

    if (client.alias) string += " (" + client.alias + ")";
    if (client.hmisID) string += " " + client.hmisID;

    return string;
  };

  return (
    <ClientContext.Provider
      value={{
        newClient,
        cloneClient,
        isDuplicate,
        insertClient,
        clientKey,
        clientProfileToString,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
