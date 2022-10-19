import LLButton from "../../../LLComponents/LLButton";

const SHSEHeader = ({
  header,
  leftButton,
}: {
  header: string;
  leftButton: JSX.Element;
}): JSX.Element => {
  return (
    <div className="flex flex-row flex-nowrap justify-between items-center space-x-4 bg-gray-300 p-2 rounded-t-lg">
      {leftButton}
      <h3 className="text-lg font-bold">{header}</h3>
      <LLButton type="submit">✓</LLButton>
    </div>
  );
};

export default SHSEHeader;
