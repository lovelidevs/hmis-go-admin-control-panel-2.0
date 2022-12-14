import { ReactNode, useContext } from "react";

import { Navigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

const RequireAuth = ({
  children,
  requireAdminAuth,
}: {
  children: ReactNode;
  requireAdminAuth?: boolean;
}): JSX.Element => {
  const authContext = useContext(AuthContext);

  if (!authContext?.user) {
    return <Navigate to="/login" replace />;
  }

  if (authContext?.userData?.status !== "confirmed") {
    return <Navigate to="/request-access" replace />;
  }

  if (requireAdminAuth && authContext.userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
