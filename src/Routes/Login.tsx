import {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
import LLAuthMain from "../LLComponents/LLAuth/LLAuthMain";
import LLButton from "../LLComponents/LLButton";
import LLLegendInput from "../LLComponents/LLLegendInput";
import LLOkDialog from "../LLComponents/LLOkDialog";

const Login = () => {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (authContext?.user) return navigate("/", { replace: true });
  }, [authContext?.user, navigate]);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const logIn = async () => {
    try {
      await authContext?.logIn(email, password);
    } catch (error) {
      return showDialog(String(error));
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return logIn();
  };

  return (
    <>
      <LLAuthMain>
        <form
          className="flex flex-col flex-nowrap justify-center items-center space-y-6 rounded-lg bg-white p-6"
          onSubmit={(event) => {
            event.preventDefault();
            logIn();
          }}
        >
          <div className="flex flex-col flex-nowrap justify-start items-stretch space-y-2">
            <LLLegendInput
              legend="email"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              onKeyUp={handleKeyUp}
              autoFocus={true}
            />
            <LLLegendInput
              legend="password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              onKeyUp={handleKeyUp}
            />
            <Link className="underline" to="/request-reset-password">
              Reset password
            </Link>
          </div>
          <div className="flex flex-row flex-nowrap justify-center items-center space-x-4">
            <LLButton type="submit">Log In</LLButton>
            <Link
              className="text-black rounded bg-cyan-300 hover:bg-cyan-400 px-4 py-2"
              to="/sign-up"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </LLAuthMain>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default Login;
