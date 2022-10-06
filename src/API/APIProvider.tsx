import { ReactNode } from "react";

const APIProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <>{children}</>;
};

export default APIProvider;
