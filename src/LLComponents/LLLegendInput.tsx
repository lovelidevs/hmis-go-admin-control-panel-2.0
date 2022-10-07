import React, { KeyboardEventHandler } from "react";

const LLLegendInput = ({
  legend,
  type,
  value,
  onChange,
  onKeyUp,
  autoFocus,
}: {
  legend: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
}): JSX.Element => {
  return (
    <fieldset className="rounded-lg border border-black pt-1 pb-2 px-2">
      <legend className="text-cyan-300 px-2">{legend}</legend>
      <input
        className="p-1"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyUp={onKeyUp}
        autoFocus={autoFocus}
      />
    </fieldset>
  );
};

export default LLLegendInput;
