import { useContext } from "react";

import { useQuery } from "@apollo/client";

import {
  LOAD_USER_DATA,
  sortUserData,
  UserDataContext,
  UserDatum,
} from "../../API/UserDataProvider";
import { AuthContext } from "../../Authentication/AuthProvider";
import LLAutosaveStatusBar from "../../LLComponents/LLAutosaveStatusBar";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";
import LLUserDatum from "../../LLComponents/LLUserDatum";

const UserEditor = () => {
  const authContext = useContext(AuthContext);
  const userDatumContext = useContext(UserDataContext);

  const { loading, error, data } = useQuery(LOAD_USER_DATA, {
    variables: { organization: authContext?.userData?.organization },
  });

  if (loading || error || !userDatumContext) {
    if (error) {
      console.log("Error loading user data:");
      console.log(error);
    }

    return <LLLoadingSpinner />;
  }

  const userData = structuredClone(data.userdata) as UserDatum[];
  sortUserData(userData);

  return (
    <main className="flex flex-col flex-nowrap justify-start items-center space-y-4 py-4">
      <LLAutosaveStatusBar
        updateLoading={userDatumContext.updateLoading}
        updateError={userDatumContext.updateError}
      />
      <ul className="flex flex-col justify-start items-center space-y-4">
        {userData.map((userDatum) => (
          <li key={userDatum._id}>
            <LLUserDatum
              userDatum={userDatum}
              onChange={(property: object) =>
                userDatumContext.updateUserDatum(userDatum, property)
              }
              onDelete={() => userDatumContext.resetUserDatum(userDatum)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default UserEditor;
