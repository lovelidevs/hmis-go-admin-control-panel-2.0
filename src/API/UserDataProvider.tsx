import { ReactNode } from "react";

import gql from "graphql-tag";

const userDatumFragment = gql`
  fragment Userdatum_userdatum on Userdatum {
    _id
    email
    organization
    role
    status
  }
`;

export const LOAD_USER_DATA = gql`
  query LoadUserData($organization: String!) {
    userdata(query: { organization: $organization }) {
      ...Userdatum_userdatum
    }
  }
  ${userDatumFragment}
`;

export const UPDATE_USER_DATUM = gql`
  mutation UpdateUserDatum($_id: String!, $userDatum: UserdatumUpdateInput!) {
    updateOneUserdatum(query: { _id: $_id }, set: $userDatum) {
      ...Userdatum_userdatum
    }
  }
  ${userDatumFragment}
`;

export type UserDatum = {
  _id: string;
  organization: string;
  email: string;
  role: "user" | "admin" | "";
  status: "pending" | "confirmed" | "rejected" | "";
};

const UserDataProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return <>{children}</>;
};

export default UserDataProvider;
