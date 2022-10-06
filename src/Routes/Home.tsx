import { useContext } from "react";

import { AuthContext } from "../Authentication/AuthProvider";
import LLButton from "../LLComponents/LLButton";

const Home = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  return (
    <LLButton type="button" onClick={authContext?.logOut}>
      Log Out
    </LLButton>
  );
};

export default Home;
