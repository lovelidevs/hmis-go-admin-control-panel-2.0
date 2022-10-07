import { ReactNode } from "react";

import ServiceProvider from "./ServiceProvider";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  // TODO: Need to add Apollo first
  return <ServiceProvider>{children}</ServiceProvider>;
};

export default APIProvider;
