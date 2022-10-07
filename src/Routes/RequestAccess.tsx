import {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Authentication/AuthProvider";
import LLAuthForm from "../LLComponents/LLAuth/LLAuthForm";
import LLAuthMain from "../LLComponents/LLAuth/LLAuthMain";
import LLButton from "../LLComponents/LLButton";
import LLLegendInput from "../LLComponents/LLLegendInput";
import LLOkDialog from "../LLComponents/LLOkDialog";

const RequestAccess = () => {
  const authContext = useContext(AuthContext);

  const [organization, setOrganization] = useState<string>("");

  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!authContext?.user) return navigate("/login", { replace: true });
  }, [authContext?.user, navigate]);

  useEffect(() => {
    if (authContext?.userData?.status === "confirmed")
      return navigate("/", { replace: true });
  }, [authContext?.userData?.status, navigate]);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const requestAccess = async () => {
    if (!organization) return showDialog("Missing organization ID");

    try {
      await authContext?.requestAccess(organization);
    } catch (error) {
      return showDialog(String(error));
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return requestAccess();
  };

  return (
    <>
      <LLAuthMain>
        <LLAuthForm
          onSubmit={(event) => {
            event.preventDefault();
            requestAccess();
          }}
        >
          <div className="flex flex-col flex-nowrap justify-start items-center space-y-2">
            <p>Request to join an organization:</p>
            <LLLegendInput
              legend="organization ID"
              type="text"
              value={organization}
              onChange={(value) => setOrganization(value)}
              onKeyUp={handleKeyUp}
              autoFocus={true}
            />
          </div>
          <LLButton type="submit">Send Request</LLButton>
          {authContext?.userData?.status !== "" && (
            <p>{`Request is ${authContext?.userData?.status.toUpperCase()} to join organization ${
              authContext?.userData?.organization
            }`}</p>
          )}
        </LLAuthForm>
      </LLAuthMain>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default RequestAccess;
