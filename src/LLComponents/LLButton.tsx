import { ReactNode } from "react";

const LLButton = ({
  children,
  type,
  onClick,
}: {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) => {
  return (
    <button
      className="text-black rounded bg-cyan-300 hover:bg-cyan-400 px-4 py-2"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default LLButton;
