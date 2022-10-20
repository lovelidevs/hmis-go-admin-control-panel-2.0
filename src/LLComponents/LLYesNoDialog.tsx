import React from "react";

import LLButton from "./LLButton";
import LLLoadingSpinner from "./LLLoadingSpinner";

type LLYesNoDialogProps = {
  yesNoQuestion: string;
  callback: (isYes: boolean) => void;
};

const LLYesNoDialog = React.forwardRef<HTMLDialogElement, LLYesNoDialogProps>(
  (
    { yesNoQuestion, callback }: LLYesNoDialogProps,
    ref: React.ForwardedRef<HTMLDialogElement>
  ): JSX.Element => {
    if (!yesNoQuestion || !callback)
      return (
        <dialog ref={ref}>
          <form method={"dialog"}>
            <LLLoadingSpinner />
            <LLButton type="submit">Cancel</LLButton>
          </form>
        </dialog>
      );

    return (
      <dialog ref={ref}>
        <form
          method={"dialog"}
          className={
            "flex flex-col flex-nowrap justify-start items-center space-y-4"
          }
        >
          <p>{yesNoQuestion}</p>
          <div className="flex flex-row flex-nowrap justify-center items-center space-x-4">
            <LLButton type="submit" onClick={() => callback(false)}>
              No
            </LLButton>
            <LLButton type="submit" onClick={() => callback(true)}>
              Yes
            </LLButton>
          </div>
        </form>
      </dialog>
    );
  }
);

export default LLYesNoDialog;
