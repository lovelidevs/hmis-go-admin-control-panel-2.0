import { KeyboardEventHandler, useContext, useRef, useState } from "react";

import { AuthContext } from "../Authentication/AuthProvider";
import LLAuthForm from "../LLComponents/LLAuth/LLAuthForm";
import LLAuthMain from "../LLComponents/LLAuth/LLAuthMain";
import LLButton from "../LLComponents/LLButton";
import LLLegendInput from "../LLComponents/LLLegendInput";
import LLOkDialog from "../LLComponents/LLOkDialog";

const SignUp = () => {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [confirmationEmailSent, setConfirmationEmailSent] =
    useState<boolean>(false);

  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const signUp = async () => {
    if (email !== confirmEmail) return showDialog("Emails do not match");

    if (password !== confirmPassword)
      return showDialog("Passwords do not match");

    if (!confirmationEmailSent) {
      try {
        await authContext?.registerUser(email, password);
      } catch (error) {
        return showDialog(String(error));
      }

      setConfirmationEmailSent(true);
    } else {
      try {
        await authContext?.resendConfirmationEmail(email);
      } catch (error) {
        return showDialog(String(error));
      }
    }

    showDialog("Confirmation email sent");
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return signUp();
  };

  return (
    <>
      <LLAuthMain>
        <LLAuthForm
          onSubmit={(event) => {
            event.preventDefault();
            signUp();
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
              legend="confirm email"
              type="email"
              value={confirmEmail}
              onChange={(value) => setConfirmEmail(value)}
              onKeyUp={handleKeyUp}
            />
            <LLLegendInput
              legend="password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
              onKeyUp={handleKeyUp}
            />
            <LLLegendInput
              legend="confirm password"
              type="password"
              value={confirmPassword}
              onChange={(value) => setConfirmPassword(value)}
              onKeyUp={handleKeyUp}
            />
          </div>
          <LLButton type="submit">
            {confirmationEmailSent
              ? "Resend Confirmation Email"
              : "Send Confirmation Email"}
          </LLButton>
        </LLAuthForm>
      </LLAuthMain>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default SignUp;
