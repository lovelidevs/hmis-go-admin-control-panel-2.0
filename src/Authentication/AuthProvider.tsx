import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import * as Realm from "realm-web";

import { UserDatum } from "../API/UserDataProvider";

type AuthContextType = {
  user: Realm.User | null;
  userData: UserDatum | null;
  isAuthenticated: () => boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const realmApp = useRef<Realm.App>(
    new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID as string })
  );

  const [user, setUser] = useState<Realm.User | null>(
    realmApp.current.currentUser
  );

  const [userData, setUserData] = useState<UserDatum | null>(
    user?.customData ? (user.customData as UserDatum) : null
  );

  const refreshUserData = useCallback(async (user: Realm.User | null) => {
    if (!user) return setUserData(null);

    const customData = await user.refreshCustomData();

    setUserData(customData ? (customData as UserDatum) : null);
  }, []);

  useEffect(() => {
    refreshUserData(user);
  }, [user, refreshUserData]);

  const isAuthenticated = (): boolean => {
    return realmApp.current.currentUser !== null;
  };

  const logIn = async (email: string, password: string) => {
    const emailToLowerCase = email.toLowerCase();

    try {
      const realmUser = await realmApp.current.logIn(
        Realm.Credentials.emailPassword(emailToLowerCase, password)
      );

      if (!realmUser) throw new Error("Unable to log in");

      // TODO: Custom Data stuff

      setUser(realmUser);
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    await user?.logOut();
    setUser(null);
  };

  // TODO: All the other Auth stuff, register, requestAccess, etc...

  return (
    <AuthContext.Provider
      value={{ user, userData, isAuthenticated, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
