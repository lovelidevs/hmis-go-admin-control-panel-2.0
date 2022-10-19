import { ServiceCategoryData } from "../../../API/ServiceProvider";
import LLButton from "../../../LLComponents/LLButton";
import SHSEHeader from "./SHSEHeader";

const SHSECategorySelect = ({
  categories,
  onSelect,
}: {
  categories: ServiceCategoryData[];
  onSelect: (uuid: string) => void;
}) => {
  return (
    <>
      <SHSEHeader
        header={"Service Editor"}
        leftButton={<LLButton twStyle="invisible">✓</LLButton>}
      />
      <ul className="flex flex-col flex-nowrap justify-start items-stretch space-y-2 p-2 rounded-b-lg">
        {categories.map((category) => (
          <li key={category.uuid}>
            <button
              type="button"
              className="w-full flex flex-row flex-nowrap justify-between items-center bg-gray-800 rounded-lg text-cyan-300 p-2 hover:text-cyan-500"
              onClick={() => onSelect(category.uuid)}
            >
              <p>{category.category}</p>
              <p>›</p>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SHSECategorySelect;
