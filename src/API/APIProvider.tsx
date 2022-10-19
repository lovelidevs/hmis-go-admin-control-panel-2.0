import { ReactNode } from "react";

import ApolloClientProvider from "./ApolloClientProvider";
import ClientProvider from "./ClientProvider";
import LocationProvider from "./LocationProvider";
import NotesProvider from "./NotesProvider";
import ServiceProvider from "./ServiceProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ApolloClientProvider>
      <ServiceProvider>
        <LocationProvider>
          <ClientProvider>
            <NotesProvider>{children}</NotesProvider>
          </ClientProvider>
        </LocationProvider>
      </ServiceProvider>
    </ApolloClientProvider>
  );
};

export default APIProvider;
