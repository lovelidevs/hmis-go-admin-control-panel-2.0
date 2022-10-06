import { ReactNode } from "react";

const LLDialogButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  return <button onClick={onClick}>{children}</button>;
};

export default LLDialogButton;
