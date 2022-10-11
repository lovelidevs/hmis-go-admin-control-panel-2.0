import { ReactNode } from "react";

import ApolloClientProvicer from "./ApolloClientProvider";
import ServiceProvider from "./ServiceProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ApolloClientProvicer>
      <ServiceProvider>{children}</ServiceProvider>
    </ApolloClientProvicer>
  );
};

export default APIProvider;
