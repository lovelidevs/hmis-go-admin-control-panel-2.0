import { ReactNode, useContext } from "react";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { AuthContext } from "../Authentication/AuthProvider";

const GQL_URI = `https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/${
  process.env.REACT_APP_REALM_APP_ID as string
}/graphql`;

const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);

  const client = new ApolloClient({
    link: new HttpLink({
      uri: GQL_URI,
      fetch: async (uri, options) => {
        authContext?.user?.refreshCustomData();

        const authHeader: HeadersInit = {
          Authorization: `Bearer ${authContext?.user?.accessToken}`,
        };

        if (!options) return fetch(uri, { headers: authHeader });

        options.headers = authHeader;
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
