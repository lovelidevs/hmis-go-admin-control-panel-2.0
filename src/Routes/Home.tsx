import { useContext } from "react";

import { Outlet } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
import LLButton from "../LLComponents/LLButton";
import LLNavLink from "../LLComponents/LLNavLink";

const Home = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  return (
    <main className="w-full min-h-screen bg-stone-100">
      <div className="flex flex-row flex-nowrap justify-between items-center bg-gray-800 px-4 py-3 text-xl">
        <LLButton twStyle="invisible" type="button">
          Log Out
        </LLButton>
        <nav className="flex flex-row flex-nowrap justify-center items-center space-x-3">
          <LLNavLink to="reports">Reports</LLNavLink>
        </nav>
        <LLButton type="button" onClick={authContext?.logOut}>
          Log Out
        </LLButton>
      </div>
      <Outlet />
    </main>
  );
};

export default Home;
