import { KeyboardEventHandler, useContext, useRef, useState } from "react";

import { AuthContext } from "../Authentication/AuthProvider";
import LLAuthMain from "../LLComponents/LLAuth/LLAuthMain";
import LLButton from "../LLComponents/LLButton";
import LLLegendInput from "../LLComponents/LLLegendInput";
import LLOkDialog from "../LLComponents/LLOkDialog";

const RequestResetPassword = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");

  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const sendResetPasswordEmail = async () => {
    try {
      await authContext?.sendResetPasswordEmail(email);
    } catch (error) {
      showDialog(String(error));
    }

    showDialog("Reset password email sent");
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return sendResetPasswordEmail();
  };

  // TODO: Need to add reset-password page

  return (
    <>
      <LLAuthMain>
        <form
          className="flex flex-col flex-nowrap justify-center items-center space-y-6 rounded-lg bg-white p-6"
          onSubmit={(event) => {
            event.preventDefault();
            sendResetPasswordEmail();
          }}
        >
          <LLLegendInput
            legend="email"
            type="email"
            value={email}
            onChange={(value) => setEmail(value)}
            onKeyUp={handleKeyUp}
            autoFocus={true}
          />
          <LLButton type="submit">Sent Reset Password Email</LLButton>
        </form>
      </LLAuthMain>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default RequestResetPassword;
