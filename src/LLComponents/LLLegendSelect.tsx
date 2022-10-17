const LLLegendSelect = ({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) => {
  return (
    <fieldset className="flex flex-col flex-nowrap justify-start items-center rounded-lg border border-black pt-1 pb-2 px-2">
      <legend className="text-cyan-300 px-2">{legend}</legend>
      <select
        className="bg-transparent px-1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </fieldset>
  );
};

export default LLLegendSelect;
