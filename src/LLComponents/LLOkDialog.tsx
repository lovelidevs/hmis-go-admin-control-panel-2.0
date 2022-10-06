import { ForwardedRef, forwardRef } from "react";

import LLDialogButton from "./LLDialogButton";

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
        <form method="dialog">
          <p>{message}</p>
          <LLDialogButton onClick={callback}>OK</LLDialogButton>
        </form>
      </dialog>
    );
  }
);

export default LLOkDialog;
