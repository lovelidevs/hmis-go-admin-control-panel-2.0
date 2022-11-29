import { useContext, useMemo, useState } from "react";

import { useQuery } from "@apollo/client";

import {
  LOAD_ORGANIZATIONS,
  organizationsDataToOrganizations,
} from "../../API/OrganizationProvider";
import {
  LOAD_USER_DATA,
  sortUserData,
  UserDataContext,
  UserDatum,
} from "../../API/UserDataProvider";
import LLAutosaveStatusBar from "../../LLComponents/LLAutosaveStatusBar";
import LLLegendSelect from "../../LLComponents/LLLegendSelect";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";
import LLUserDatum from "../../LLComponents/LLUserDatum";

const SuperAdminUserEditor = () => {
  const userDatumContext = useContext(UserDataContext);

  const [organization, setOrganization] = useState<string>("");

  const {
    loading: organizationsLoading,
    error: organizationsError,
    data: organizationsData,
  } = useQuery(LOAD_ORGANIZATIONS);

  const organizations: string[] = useMemo(
    () => organizationsDataToOrganizations(organizationsData),
    [organizationsData]
  );

  const {
    loading: userDataLoading,
    error: userDataError,
    data: userData,
    refetch: loadUserData,
  } = useQuery(LOAD_USER_DATA, { variables: { organization: organization } });

  if (organizationsLoading || organizationsError || !userDatumContext) {
    if (organizationsError) {
      console.log("Error loading organizations:");
      console.log(organizationsError);
    }

    return <LLLoadingSpinner />;
  }

  const sortedUserData: UserDatum[] | undefined = userData?.userdata
    ? (structuredClone(userData.userdata) as UserDatum[])
    : undefined;

  if (sortedUserData) sortUserData(sortedUserData);

  const handleOrganizationChange = (value: string) => {
    setOrganization(value);
    loadUserData({ organization: value });
  };

  return (
    <main className="flex flex-col flex-nowrap justify-start items-center space-y-4 py-4">
      <LLAutosaveStatusBar
        updateLoading={userDatumContext.updateLoading}
        updateError={userDatumContext.updateError}
      />
      <LLLegendSelect
        legend="Organization"
        value={organization}
        onChange={handleOrganizationChange}
        options={organizations}
      />
      {userDataLoading ? <LLLoadingSpinner /> : null}
      {userDataError ? <p>String(userDataError)</p> : null}
      {sortedUserData ? (
        <ul className="flex flex-col justify-start items-center space-y-4">
          {sortedUserData.map((userDatum) => (
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
      ) : null}
    </main>
  );
};

export default SuperAdminUserEditor;
