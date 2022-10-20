import { useContext, useEffect, useRef, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
import LLAuthMain from "../LLComponents/LLAuth/LLAuthMain";
import LLOkDialog from "../LLComponents/LLOkDialog";

const EmailConfirmation = () => {
  const authContext = useContext(AuthContext);

  const [dialogMessage, setDialogMessage] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const dialog = useRef<HTMLDialogElement>(null);

  const navigate = useNavigate();

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  useEffect(() => {
    (async () => {
      try {
        await authContext?.confirmUser(
          searchParams.get("token"),
          searchParams.get("tokenId")
        );
        showDialog(
          "Confirmation Successful!\nIf using HMIS Go, navigate back to the app."
        );
      } catch (error) {
        showDialog(String(error));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <LLAuthMain>
        <p className="text-center text-xl text-cyan-300 font-bold">
          Attempting to confirm user...
        </p>
      </LLAuthMain>
      <LLOkDialog
        ref={dialog}
        message={dialogMessage}
        callback={() => navigate("/", { replace: true })}
      />
    </>
  );
};

export default EmailConfirmation;
