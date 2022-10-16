import { useContext, useEffect, useState } from "react";

import dayjs from "dayjs";

import { Client, ClientContext } from "../API/ClientProvider";
import LLButton from "../LLComponents/LLButton";
import LLGridLabeledInput from "../LLComponents/LLGridLabeledInput";

const ClientProfile = ({
  client,
  onSave,
  form,
}: {
  client: Client;
  onSave: (clientClone: Client) => Promise<void>;
  form?: HTMLFormElement;
}) => {
  const clientContext = useContext(ClientContext);

  const [clientProfile, setClientProfile] = useState<Client>(client);
  const [disabled, setDisabled] = useState<boolean>(
    form === undefined ? true : false
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setClientProfile(client);
    setDisabled(form === undefined ? true : false === undefined ? true : false);
    setErrorMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const handleChange = (property: object) => {
    if (!clientContext) return console.log("No client context");

    setClientProfile({
      ...clientContext.cloneClient(clientProfile),
      ...property,
    });
  };

  const handleSave = async () => {
    if (!clientContext) return console.log("No client context");

    if (!clientProfile.lastName) return setErrorMessage("Missing last name");
    if (!clientProfile.firstName) return setErrorMessage("Missing first name");

    const clientClone = clientContext.cloneClient(clientProfile);

    if (clientClone.DOB)
      clientClone.DOB = dayjs(clientClone.DOB).format("YYYY-MM-DD");

    try {
      await onSave(clientClone);
      form?.submit();
    } catch (error) {
      return setErrorMessage(String(error));
    }
  };

  const handleCancel = () => {
    setClientProfile(client);
    setDisabled(true);
    form?.submit();
  };

  return (
    <div className="flex flex-col flex-nowrap justify-start items-center space-y-5 bg-purple-300 rounded-lg p-4">
      <p className="text-xl font-extrabold text-black">
        {client.lastName
          ? client.firstName + " " + client.lastName
          : "NEW CLIENT"}
      </p>
      <div className="grid grid-cols-3 gap-2 items-baseline">
        <LLGridLabeledInput
          label="Last Name"
          type="text"
          value={clientProfile.lastName}
          onChange={(value) => handleChange({ lastName: value })}
          disabled={disabled}
        />
        <LLGridLabeledInput
          label="First Name"
          type="text"
          value={clientProfile.firstName}
          onChange={(value) => handleChange({ firstName: value })}
          disabled={disabled}
        />
        <LLGridLabeledInput
          label="DOB"
          type="date"
          value={clientProfile.DOB}
          onChange={(value) => handleChange({ DOB: value })}
          disabled={disabled}
        />
        <LLGridLabeledInput
          label="Alias"
          type="text"
          value={clientProfile.alias}
          onChange={(value) => handleChange({ alias: value })}
          disabled={disabled}
        />
        <LLGridLabeledInput
          label="HMIS ID"
          type="text"
          value={clientProfile.hmisID}
          onChange={(value) => handleChange({ hmisID: value })}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-row flex-nowrap justify-center items-stretch space-x-4">
        {disabled && (
          <LLButton type="button" onClick={() => setDisabled(false)}>
            Edit
          </LLButton>
        )}
        {!disabled && (
          <>
            <LLButton type="button" onClick={handleSave}>
              Save
            </LLButton>
            <LLButton type="button" onClick={handleCancel}>
              Cancel
            </LLButton>
          </>
        )}
      </div>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ClientProfile;
