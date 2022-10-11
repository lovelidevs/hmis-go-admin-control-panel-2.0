import { ReactNode, useCallback, useContext, useEffect, useState } from "react";

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

const ApolloClientProvicer = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);

  const createApolloClient = useCallback((user?: Realm.User | null) => {
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

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    createApolloClient(authContext?.user)
  );

  useEffect(() => {
    setClient(createApolloClient(authContext?.user));
  }, [authContext?.user, createApolloClient]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvicer;
