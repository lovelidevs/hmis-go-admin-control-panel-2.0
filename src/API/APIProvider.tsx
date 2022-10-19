import { ReactNode } from "react";

import ApolloClientProvider from "./ApolloClientProvider";
import ClientProvider from "./ClientProvider";
import LocationProvider from "./LocationProvider";
import NotesProvider from "./NotesProvider";
import ServiceProvider from "./ServiceProvider";
import UserDataProvider from "./UserDataProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ApolloClientProvider>
      <UserDataProvider>
        <ServiceProvider>
          <LocationProvider>
            <ClientProvider>
              <NotesProvider>{children}</NotesProvider>
            </ClientProvider>
          </LocationProvider>
        </ServiceProvider>
      </UserDataProvider>
    </ApolloClientProvider>
  );
};

export default APIProvider;
