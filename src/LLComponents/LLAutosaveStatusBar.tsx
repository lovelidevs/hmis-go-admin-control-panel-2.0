import { useState } from "react";

import { ApolloError } from "@apollo/client";
import dayjs from "dayjs";

const LLAutosaveStatusBar = ({
  updateLoading,
  updateError,
}: {
  updateLoading: boolean;
  updateError: ApolloError | undefined;
}): JSX.Element => {
  const [autosaveDayjs, setAutosaveDayjs] = useState<dayjs.Dayjs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (updateLoading && !isLoading) {
    setAutosaveDayjs(dayjs());
    setIsLoading(true);
  }

  if (!updateLoading && isLoading) setIsLoading(false);

  if (updateLoading) return <p>Saving...</p>;

  if (updateError)
    return (
      <p>{"Save Failed. Latest changes reverted.\n" + String(updateError)}</p>
    );

  if (!autosaveDayjs) return <p>Autosave Enabled</p>;

  return (
    <p>{"Last saved at " + autosaveDayjs.format("h:mm A on MMMM D, YYYY")}</p>
  );
};

export default LLAutosaveStatusBar;
