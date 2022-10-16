import { useContext, useRef, useState } from "react";

import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import omitDeep from "omit-deep-lodash";

import {
  CLIENT,
  Client,
  ClientContext,
  CLIENT_SEARCH,
  UPDATE_CLIENT,
} from "../../API/ClientProvider";
import ClientProfile from "../../ClientSearch/ClientProfile";
import LLButton from "../../LLComponents/LLButton";
import LLDebouncedInput from "../../LLComponents/LLDebouncedInput";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";

const ClientSearch = (): JSX.Element => {
  const clientContext = useContext(ClientContext);

  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Client[] | null>(null);
  const [newClient, setNewClient] = useState<Client | null>(null);

  const newClientDialog = useRef<HTMLDialogElement>(null);
  const newClientForm = useRef<HTMLFormElement>(null);

  const [clientSearch] = useLazyQuery(CLIENT_SEARCH);
  const [loadClient, { data }] = useLazyQuery(CLIENT);
  const [updateClient] = useMutation(UPDATE_CLIENT);

  const handleDebouncedSearchTextChange = (value: string) => {
    setSearchText(value);

    if (!value) return setSearchResults(null);

    clientSearch({
      variables: { query: value },
      onCompleted: (data) => setSearchResults(data.search),
      onError: (error: ApolloError) => console.log(error),
    });
  };

  const handleSearchResultClick = (client: Client) => {
    loadClient({
      variables: { _id: client._id },
      onCompleted: () => {
        setSearchText("");
        setSearchResults([]);
      },
    });
  };

  const openNewClient = () => {
    if (!clientContext) return console.log("No client context");

    setNewClient(clientContext.newClient);
    if (!newClientDialog.current?.open) newClientDialog.current?.showModal();
  };

  const handleSaveNewClient = async (clientClone: Client) => {
    if (!clientContext) throw new Error("No client context");

    try {
      await clientContext.insertClient(clientClone);
      loadClient({
        variables: { _id: clientClone._id.toString() },
      });
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateClient = async (clientClone: Client) => {
    await updateClient({
      variables: {
        _id: clientClone._id,
        client: omitDeep(clientClone, ["__typename"]),
      },
      onError: (error: ApolloError) => {
        throw error;
      },
    });
  };

  if (!clientContext) return <LLLoadingSpinner />;

  return (
    <>
      <main className="flex flex-col flex-nowrap justify-start items-center space-y-6">
        <div className="relative flex flex-col flex-nowrap justify start items-start mt-4">
          <div className="flex flex-row row-nowrap justify-center items-stretch space-x-4">
            <LLDebouncedInput
              type="text"
              value={searchText}
              onChange={handleDebouncedSearchTextChange}
              placeholder="Client Search"
              twStyle="text-xl"
            />
            <LLButton type="button" onClick={openNewClient}>
              New Client
            </LLButton>
          </div>
          {searchResults && searchResults.length > 0 && (
            <ul className="absolute top-full z-10 bg-gray-800">
              {searchResults.map((client) => (
                <li key={clientContext.clientKey(client)}>
                  <button
                    type="button"
                    className="text-white p-2"
                    onClick={() => handleSearchResultClick(client)}
                  >
                    {clientContext.clientProfileToString(client)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {data?.client && (
          <div className="flex flex-row flex-wrap justify-center items-start space-x-4">
            <ClientProfile
              client={data.client}
              onSave={(clientClone: Client) => handleUpdateClient(clientClone)}
            />
          </div>
        )}
      </main>
      <dialog ref={newClientDialog} className="rounded-lg">
        <form ref={newClientForm} method="dialog">
          <ClientProfile
            client={newClient ? newClient : clientContext.newClient()}
            onSave={handleSaveNewClient}
            form={newClientForm.current ? newClientForm.current : undefined}
          />
        </form>
      </dialog>
    </>
  );
};

export default ClientSearch;
