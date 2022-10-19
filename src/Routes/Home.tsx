import { useContext } from "react";

import { Outlet } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
import LLButton from "../LLComponents/LLButton";
import LLNavLink from "../LLComponents/LLNavLink";

const Home = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  return (
    <main className="w-screen h-screen bg-stone-100 flex flex-col flex-nowrap justify-start items-stretch">
      <div className="flex flex-row flex-nowrap justify-between items-center bg-gray-800 px-4 py-3 text-xl">
        <LLButton twStyle="invisible" type="button">
          Log Out
        </LLButton>
        <nav className="flex flex-row flex-nowrap justify-center items-center space-x-3">
          <LLNavLink to="reports">Reports</LLNavLink>
          <LLNavLink to="services">Services</LLNavLink>
          <LLNavLink to="locations">Locations</LLNavLink>
          <LLNavLink to="clients">Clients</LLNavLink>
          <LLNavLink to="notes">Notes</LLNavLink>
        </nav>
        <LLButton type="button" onClick={authContext?.logOut}>
          Log Out
        </LLButton>
      </div>
      <div className="w-full h-full overflow-scroll shrink">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
