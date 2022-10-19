import { ClientService } from "../../../API/ClientProvider";
import { ServiceCategoryData } from "../../../API/ServiceProvider";
import LLButton from "../../../LLComponents/LLButton";
import SHSECategoryLI from "./SHSECategoryLI";
import SHSEHeader from "./SHSEHeader";

const SHSECategory = ({
  category,
  services,
  onBack,
  onChange,
  onSelect,
}: {
  category: ServiceCategoryData;
  services: ClientService[];
  onBack: () => void;
  onChange: (servicesClone: ClientService[]) => void;
  onSelect: (uuid: string) => void;
}): JSX.Element => {
  return (
    <>
      <SHSEHeader
        header={category.category}
        leftButton={<LLButton onClick={onBack}>←</LLButton>}
      />
      <ul className="flex flex-col flex-nowrap justify-start items-stretch space-y-2 p-2 rounded-b-lg">
        {category.services.map((service) => (
          <SHSECategoryLI
            key={service.uuid}
            service={service}
            services={services}
            onChange={onChange}
            onSelect={(uuid: string) => onSelect(uuid)}
          />
        ))}
      </ul>
    </>
  );
};

export default SHSECategory;
