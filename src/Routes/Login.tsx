import { KeyboardEventHandler, useContext, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
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

    navigate("/", { replace: true });
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return logIn();
  };

  return (
    <>
      <main className="flex flex-col flex-nowrap justify-center items-center w-screen h-screen bg-gray-800">
        <form
          className="flex flex-col flex-nowrap justify-center items-center space-y-6 rounded-lg bg-white p-6"
          onSubmit={(event) => {
            event.preventDefault();
            logIn();
          }}
        >
          <div className="flex flex-col flex-nowrap justify-start items-start space-y-2">
            <LLLegendInput
              legend="Email"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              onKeyUp={handleKeyUp}
              autoFocus={true}
            />
            <LLLegendInput
              legend="Password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              onKeyUp={handleKeyUp}
            />
          </div>
          <LLButton type="submit">Log In</LLButton>
        </form>
      </main>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default Login;
