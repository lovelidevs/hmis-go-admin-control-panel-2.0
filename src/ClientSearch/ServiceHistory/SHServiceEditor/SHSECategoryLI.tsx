import { useMemo } from "react";

import { ClientService } from "../../../API/ClientProvider";
import { ServiceData } from "../../../API/ServiceProvider";
import LLButton from "../../../LLComponents/LLButton";

const SHSECategoryLI = ({
  service,
  services,
  onChange,
  onSelect,
}: {
  service: ServiceData;
  services: ClientService[];
  onChange: (servicesClone: ClientService[]) => void;
  onSelect: (uuid: string) => void;
}): JSX.Element => {
  const index = useMemo(
    (): number =>
      services.findIndex(
        (serviceObj) => serviceObj.service === service.service
      ),
    [service.service, services]
  );

  const handleCheckboxChange = (checked: boolean) => {
    const servicesClone = structuredClone(services) as ClientService[];

    if (checked) {
      servicesClone.push({
        service: service.service,
        text: null,
        count: null,
        units: null,
        list: null,
      });
    } else {
      if (index >= 0) servicesClone.splice(index, 1);
    }

    onChange(servicesClone);
  };

  const getCount = (): number => {
    if (index === -1) return 0;

    const foundService = services[index];
    return foundService.count ? foundService.count : 0;
  };

  const handleNumberChange = (count: number) => {
    const servicesClone = structuredClone(services) as ClientService[];

    if (count > 0) {
      if (index === -1)
        servicesClone.push({
          service: service.service,
          text: null,
          count,
          units: service.units ? service.units : null,
          list: null,
        });
      else servicesClone[index].count = count;
    }

    if (count <= 0 && index !== -1) servicesClone.splice(index, 1);

    onChange(servicesClone);
  };

  return (
    <li className="flex flex-row flex-nowrap justify-between items-center space-x-4 bg-gray-800 rounded-lg text-cyan-300 p-2">
      <label>{service.service}</label>
      {service.inputType === "Toggle" && (
        <input
          type={"checkbox"}
          className="w-4 h-4"
          checked={index >= 0}
          onChange={(event) => handleCheckboxChange(event.target.checked)}
        ></input>
      )}
      {service.inputType === "Counter" && (
        <input
          type={"number"}
          className="w-16 p-1 rounded-lg text-black"
          value={String(getCount())}
          onChange={(event) => handleNumberChange(Number(event.target.value))}
        />
      )}
      {(service.inputType === "Textbox" ||
        service.inputType === "Locations" ||
        service.inputType === "Custom List") && (
        <LLButton type="button" onClick={() => onSelect(service.uuid)}>
          ›
        </LLButton>
      )}
    </li>
  );
};

export default SHSECategoryLI;
