import { useContext, useState } from "react";

import { useLazyQuery } from "@apollo/client";

import {
  LOAD_USER_DATA,
  UserDataContext,
  UserDatum,
} from "../../API/UserDataProvider";
import { AuthContext } from "../../Authentication/AuthProvider";

const SuperAdminUserEditor = () => {
  const authContext = useContext(AuthContext);
  const userDatumContext = useContext(UserDataContext);

  const [userData, setUserData] = useState<UserDatum[] | null>(null);

  // TODO: Move the organization stuff later
  const [loadUserData, { loading, error, data }] = useLazyQuery(
    LOAD_USER_DATA,
    {
      variables: { organization: authContext?.userData?.organization },
    }
  );

  // TODO: Loading stuff....

  
};

export default SuperAdminUserEditor;
