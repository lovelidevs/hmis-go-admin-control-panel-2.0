import { KeyboardEventHandler, useContext, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
import LLAuthMain from "../LLComponents/LLAuth/LLAuthMain";
import LLButton from "../LLComponents/LLButton";
import LLLegendInput from "../LLComponents/LLLegendInput";
import LLOkDialog from "../LLComponents/LLOkDialog";

const ResetPassword = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [dialogMessage, setDialogMessage] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const dialog = useRef<HTMLDialogElement>(null);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const resetPassword = async () => {
    try {
      await authContext?.resetPassword(
        searchParams.get("token"),
        searchParams.get("tokenId"),
        password,
        confirmPassword
      );
      showDialog("Password reset successful!");
    } catch (error) {
      showDialog(String(error));
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return resetPassword();
  };

  return (
    <>
      <LLAuthMain>
        <div className="flex flex-col flex-nowrap justify-center items-center bg-white rounded-lg p-3 space-y-4">
          <LLLegendInput
            legend={"New Password"}
            type={"password"}
            value={password}
            onChange={(value: string) => setPassword(value)}
            onKeyUp={handleKeyUp}
            autoFocus={true}
          />
          <LLLegendInput
            legend={"Confirm Password"}
            type={"password"}
            value={confirmPassword}
            onChange={(value: string) => setConfirmPassword(value)}
            onKeyUp={handleKeyUp}
            autoFocus={true}
          />
          <LLButton type="button" onClick={resetPassword}>
            Reset Password
          </LLButton>
        </div>
      </LLAuthMain>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default ResetPassword;
