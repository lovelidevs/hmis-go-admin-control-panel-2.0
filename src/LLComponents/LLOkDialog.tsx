import { ForwardedRef, forwardRef } from "react";

import LLButton from "./LLButton";

type LLOkDialogProps = {
  message: string;
  callback?: () => void;
};

const LLOkDialog = forwardRef<HTMLDialogElement, LLOkDialogProps>(
  (
    { message, callback }: LLOkDialogProps,
    ref: ForwardedRef<HTMLDialogElement>
  ) => {
    return (
      <dialog ref={ref}>
        <form
          className="flex flex-col flex-nowrap justify-start items-center space-y-4"
          method="dialog"
        >
          <p>{message}</p>
          <LLButton onClick={callback}>OK</LLButton>
        </form>
      </dialog>
    );
  }
);

export default LLOkDialog;
