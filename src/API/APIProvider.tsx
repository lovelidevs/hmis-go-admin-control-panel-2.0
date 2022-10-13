import { ReactNode } from "react";

import ApolloClientProvider from "./ApolloClientProvider";
import LocationProvider from "./LocationProvider";
import ServiceProvider from "./ServiceProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ApolloClientProvider>
      <ServiceProvider>
        <LocationProvider>{children}</LocationProvider>
      </ServiceProvider>
    </ApolloClientProvider>
  );
};

export default APIProvider;
