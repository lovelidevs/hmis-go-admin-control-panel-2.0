import { ReactNode } from "react";

import LLAddButton from "./LLAddButton";
import LLDeleteButton from "./LLDeleteButton";

const LLMenuButtons = ({
  width,
  height,
  visibility,
  twStyle,
  onAdd,
  onRemove,
  customButtons,
}: {
  width: string;
  height: string;
  visibility: "visible" | "invisible";
  twStyle: string;
  onAdd: () => void;
  onRemove: () => void;
  customButtons?: ReactNode;
}) => {
  return (
    <div
      className={`${visibility} ${twStyle} flex flex-col flex-nowrap justify-center items-center p-2 rounded-lg`}
    >
      <LLAddButton width={width} height={height} onClick={onAdd} />
      <LLDeleteButton width={width} height={height} onClick={onRemove} />
      {customButtons}
    </div>
  );
};

export default LLMenuButtons;
