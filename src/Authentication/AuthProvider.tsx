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
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  requestAccess: (organization: string) => Promise<void>;
  sendResetPasswordEmail: (email: string) => Promise<void>;
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

  const refreshUserData = useCallback(async (realmUser: Realm.User | null) => {
    if (!realmUser) return setUserData(null);

    const customData = await realmUser.refreshCustomData();

    setUserData(customData ? (customData as UserDatum) : null);
  }, []);

  useEffect(() => {
    refreshUserData(user);
  }, [user, refreshUserData]);

  const logIn = async (email: string, password: string) => {
    const emailToLowerCase = email.toLowerCase();

    try {
      const realmUser = await realmApp.current.logIn(
        Realm.Credentials.emailPassword(emailToLowerCase, password)
      );

      if (!realmUser) throw new Error("Error logging in");

      if (!(realmUser.customData as UserDatum)?._id) {
        const result = await realmUser.functions.insertUserDatum([
          emailToLowerCase,
        ]);

        if (!result.insertId) throw result;
      }

      setUser(realmUser);
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    await user?.logOut();
    setUser(null);
  };

  const registerUser = async (email: string, password: string) => {
    const emailToLowerCase = email.toLowerCase();

    try {
      await realmApp.current.emailPasswordAuth.registerUser(
        emailToLowerCase,
        password
      );
    } catch (error) {
      throw error;
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    const emailToLowerCase = email.toLowerCase();

    try {
      await realmApp.current.emailPasswordAuth.resendConfirmationEmail(
        emailToLowerCase
      );
    } catch (error) {
      throw error;
    }
  };

  const requestAccess = async (organization: string) => {
    try {
      const result = await user?.functions.requestAccess([organization]);

      if (!result.matchedCount) throw result;
      if (result.matchedCount === 0) throw new Error("Error requesting access");
    } catch (error) {
      throw error;
    }

    refreshUserData(user);
  };

  const sendResetPasswordEmail = async (email: string) => {
    const emailToLowerCase = email.toLowerCase();

    try {
      await realmApp.current.emailPasswordAuth.sendResetPasswordEmail(
        emailToLowerCase
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        logIn,
        logOut,
        registerUser,
        resendConfirmationEmail,
        requestAccess,
        sendResetPasswordEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
