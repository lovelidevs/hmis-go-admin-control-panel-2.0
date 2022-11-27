import { ReactNode } from "react";
import React from "react";

import { ApolloError, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import omitDeep from "omit-deep-lodash";

const userDatumFragment = gql`
  fragment Userdatum_userdatum on Userdatum {
    _id
    email
    organization
    role
    status
    superAdmin
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
  superAdmin: boolean | null;
};

type UserDataContextType = {
  updateLoading: boolean;
  updateError: ApolloError | undefined;
  updateUserDatum: (userDatum: UserDatum, property: object) => void;
  resetUserDatum: (userDatum: UserDatum) => void;
  sortUserData: (userData: UserDatum[]) => void;
};

export const UserDataContext = React.createContext<UserDataContextType | null>(
  null
);

const UserDataProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [updateFunc, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER_DATUM);

  const updateUserDatum = (userDatum: UserDatum, property: object): void => {
    const userDatumClone = { ...userDatum, ...property };

    updateFunc({
      variables: {
        _id: userDatumClone._id,
        userDatum: omitDeep(userDatumClone, ["__typename"]),
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneUserdatum: userDatumClone,
      },
    });
  };

  const resetUserDatum = (userDatum: UserDatum): void => {
    const userDatumClone = structuredClone(userDatum) as UserDatum;

    userDatumClone.organization = "";
    userDatumClone.role = "";
    userDatumClone.status = "";

    updateFunc({
      variables: {
        _id: userDatumClone._id,
        userDatum: omitDeep(userDatumClone, ["__typename"]),
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneUserdatum: userDatumClone,
      },
      refetchQueries: [LOAD_USER_DATA],
    });
  };

  const sortUserData = (userData: UserDatum[]): void => {
    userData.sort((a, b) => {
      if (!a.role || !b.role || !a.status || !b.status) return 0;
      if (a.role !== b.role) return a.role.localeCompare(String(b.role));
      if (a.status !== b.status)
        return a.status.localeCompare(String(b.status));
      return a.email.localeCompare(b.email);
    });
  };

  return (
    <UserDataContext.Provider
      value={{
        updateLoading,
        updateError,
        updateUserDatum,
        resetUserDatum,
        sortUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
