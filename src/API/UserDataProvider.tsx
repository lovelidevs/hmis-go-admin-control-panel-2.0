import { ReactNode } from "react";

export type UserDatum = {
  _id: string;
  organization: string;
  email: string;
  role: "user" | "admin" | "";
  status: "pending" | "confirmed" | "";
};

const UserDataProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return <>{children}</>;
};

export default UserDataProvider;
