import { FormEventHandler, ReactNode } from "react";

const LLAuthForm = ({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) => {
  return (
    <form
      className="flex flex-col flex-nowrap justify-center items-center space-y-6 rounded-lg bg-white p-6"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

export default LLAuthForm;
