import { useContext } from "react";

import { useMutation, useQuery } from "@apollo/client";
import omitDeep from "omit-deep-lodash";

import {
  LOAD_USER_DATA,
  UPDATE_USER_DATUM,
  UserDatum,
} from "../../API/UserDataProvider";
import { AuthContext } from "../../Authentication/AuthProvider";
import LLAutosaveStatusBar from "../../LLComponents/LLAutosaveStatusBar";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";
import LLUserDatum from "../../LLComponents/LLUserDatum";

const UserEditor = () => {
  const authContext = useContext(AuthContext);

  const { loading, error, data } = useQuery(LOAD_USER_DATA, {
    variables: { organization: authContext?.userData?.organization },
  });

  const [updateUserDatum, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER_DATUM);

  const handleChange = (userDatum: UserDatum, property: object) => {
    const userDatumClone = { ...userDatum, ...property };

    updateUserDatum({
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

  const handleDelete = (userDatum: UserDatum) => {
    const userDatumClone = structuredClone(userDatum) as UserDatum;

    userDatumClone.organization = "";
    userDatumClone.role = "";
    userDatumClone.status = "";

    updateUserDatum({
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

  if (loading || error) {
    if (error) {
      console.log("Error loading user data:");
      console.log(error);
    }

    return <LLLoadingSpinner />;
  }

  const userData = structuredClone(data.userdata) as UserDatum[];

  userData.sort((a, b) => {
    if (!a.role || !b.role || !a.status || !b.status) return 0;
    if (a.role !== b.role) return a.role.localeCompare(String(b.role));
    if (a.status !== b.status) return a.status.localeCompare(String(b.status));
    return a.email.localeCompare(b.email);
  });

  return (
    <main className="flex flex-col flex-nowrap justify-start items-center space-y-4 py-4">
      <LLAutosaveStatusBar
        updateLoading={updateLoading}
        updateError={updateError}
      />
      <ul className="flex flex-col justify-start items-center space-y-4">
        {userData.map((userDatum) => (
          <li key={userDatum._id}>
            <LLUserDatum
              userDatum={userDatum}
              onChange={(property: object) => handleChange(userDatum, property)}
              onDelete={() => handleDelete(userDatum)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default UserEditor;
