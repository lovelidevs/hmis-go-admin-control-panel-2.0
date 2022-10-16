const LLGridLabeledInput = ({
  label,
  type,
  value,
  onChange,
  disabled,
}: {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}): JSX.Element => {
  return (
    <>
      <label htmlFor={label} className="text-xl p-2">
        {label}
      </label>
      <input
        type={type}
        className="text-xl p-2 col-span-2 rounded-lg"
        value={value ? value : ""}
        onChange={(event) => onChange(event?.target.value)}
        disabled={disabled}
      ></input>
    </>
  );
};

export default LLGridLabeledInput;
