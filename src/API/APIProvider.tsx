import { ReactNode } from "react";

import ApolloClientProvider from "./ApolloClientProvider";
import ServiceProvider from "./ServiceProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ApolloClientProvider>
      <ServiceProvider>{children}</ServiceProvider>
    </ApolloClientProvider>
  );
};

export default APIProvider;
