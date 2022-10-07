import { ReactNode } from "react";

import { NavLink, To } from "react-router-dom";

const LLNavLink = ({ children, to }: { children: ReactNode; to: To }) => {
  const baseTwStyle = "text-white text-xl px-3 py-1 border-cyan-300";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? baseTwStyle + " border-b-4"
          : baseTwStyle + " hover:border-b-4 hover:bg-gray-700"
      }
    >
      {children}
    </NavLink>
  );
};

export default LLNavLink;
