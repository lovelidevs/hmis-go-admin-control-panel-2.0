import { ReactNode, useContext, useState } from "react";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

import { AuthContext } from "../Authentication/AuthProvider";

const GQL_URI = `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/${
  process.env.REACT_APP_REALM_APP_ID as string
}/graphql`;

const ApolloClientProvicer = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);

  const [apolloClient, setApolloClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  // TODO: Fix this!

  const client = new ApolloClient({
    link: new HttpLink({
      uri: GQL_URI,
      fetch: async (uri, options) => {
        const authHeader: HeadersInit = {
          Authorization: `Bearer ${await authContext?.getAccessToken()}`,
        };

        if (!options) return fetch(uri, { headers: authHeader });

        options.headers = authHeader;
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });

  if (apolloClient) {
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
  } else {
    return <>{children}</>;
  }
};

export default ApolloClientProvicer;
