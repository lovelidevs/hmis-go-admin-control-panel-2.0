import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import * as Realm from "realm-web";

import { AuthContext } from "../Authentication/AuthProvider";

const GQL_URI = `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/${
  process.env.REACT_APP_REALM_APP_ID as string
}/graphql`;

type ApolloClientContextType = {
  client: ApolloClient<NormalizedCacheObject> | null;
};

export const ApolloClientContext =
  React.createContext<ApolloClientContextType | null>(null);

const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);

  const createApolloClient = useCallback((user?: Realm.User | null) => {
    if (!user) return null;

    return new ApolloClient({
      link: new HttpLink({
        uri: GQL_URI,
        fetch: async (uri, options) => {
          user?.refreshCustomData();

          const authHeader: HeadersInit = {
            Authorization: `Bearer ${user?.accessToken}`,
          };

          if (!options) return fetch(uri, { headers: authHeader });

          options.headers = authHeader;
          return fetch(uri, options);
        },
      }),
      cache: new InMemoryCache(),
    });
  }, []);

  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(
      createApolloClient(authContext?.user)
    );

  useEffect(() => {
    setClient(createApolloClient(authContext?.user));
  }, [authContext?.user, createApolloClient]);

  if (!client)
    return (
      <ApolloClientContext.Provider value={{ client }}>
        {children}
      </ApolloClientContext.Provider>
    );

  return (
    <ApolloClientContext.Provider value={{ client }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloClientContext.Provider>
  );
};

export default ApolloClientProvider;
