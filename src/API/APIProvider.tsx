import { ReactNode } from "react";

import ApolloClientProvider from "./ApolloClientProvider";
import ClientProvider from "./ClientProvider";
import LocationProvider from "./LocationProvider";
import ServiceProvider from "./ServiceProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ApolloClientProvider>
      <ServiceProvider>
        <LocationProvider>
          <ClientProvider>{children}</ClientProvider>
        </LocationProvider>
      </ServiceProvider>
    </ApolloClientProvider>
  );
};

export default APIProvider;