import React from "react";

import { ClientService } from "../../../API/ClientProvider";
import LLButton from "../../../LLComponents/LLButton";

type SHServiceEditorProps = {
  services: ClientService[];
};

const SHServiceEditor = React.forwardRef<
  HTMLDialogElement,
  SHServiceEditorProps
>(({ services }, ref) => {
  return (
    <dialog ref={ref} className="rounded-lg">
      <form
        method="dialog"
        className="flex flex-col flex-nowrap justify-start items-stretch rounded-lg overflow-y-hidden"
      >
        <div className="flex flex-row flex-nowrap justify-between items-center bg-gray-300 p-2">
          <LLButton twStyle="invisible">✓</LLButton>
          <h3 className="text-xl font-bold">Service Editor</h3>
          <LLButton type="submit">✓</LLButton>
        </div>
      </form>
    </dialog>
  );
});

export default SHServiceEditor;
