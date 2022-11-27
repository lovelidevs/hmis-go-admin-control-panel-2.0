import { ReactNode, useContext } from "react";

import { Navigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

const RequireSuperAdmin = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);

  if (!authContext?.userData?.superAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default RequireSuperAdmin;
