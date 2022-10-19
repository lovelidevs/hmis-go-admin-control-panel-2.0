import { useContext, useMemo } from "react";

import { ClientService } from "../../../API/ClientProvider";
import {
  LocationContext,
  LocationDocument,
} from "../../../API/LocationProvider";
import { ServiceData } from "../../../API/ServiceProvider";
import LLButton from "../../../LLComponents/LLButton";
import LLDebouncedAutoResizeTextarea from "../../../LLComponents/LLDebouncedAutoResizeTextarea";
import SHSEHeader from "./SHSEHeader";

const SHSEService = ({
  service,
  services,
  locationDocument,
  onChange,
  onBack,
}: {
  service: ServiceData;
  services: ClientService[];
  locationDocument: LocationDocument;
  onChange: (servicesClone: ClientService[]) => void;
  onBack: () => void;
}): JSX.Element => {
  const locationContext = useContext(LocationContext);

  const index = useMemo(
    (): number =>
      services.findIndex(
        (serviceObj) => serviceObj.service === service.service
      ),
    [service.service, services]
  );

  const getText = (): string[] => {
    if (index === -1) return [];

    const foundService = services[index];
    return foundService.text ? foundService.text.split("\n") : [];
  };

  const handleTextChange = (text: string[]) => {
    const servicesClone = structuredClone(services) as ClientService[];

    if (text.length > 0 || (text.length === 1 && text[0] !== "")) {
      if (index === -1)
        servicesClone.push({
          service: service.service,
          text: text.join("\n"),
          count: null,
          units: null,
          list: null,
        });
      else servicesClone[index].text = text.join("\n");
    }

    if (
      (text.length === 0 || (text.length === 1 && text[0] === "")) &&
      index !== -1
    )
      servicesClone.splice(index, 1);

    onChange(servicesClone);
  };

  const getList = (): string[] => {
    if (index === -1) return [];

    const foundService = services[index];
    return foundService.list ? foundService.list : [];
  };

  const handleListItemChange = (item: string, checked: boolean) => {
    console.log(item);
    console.log(checked);
    console.log(index);

    const servicesClone = structuredClone(services) as ClientService[];
    handleListItemChangeHelper(item, checked, servicesClone);
    onChange(servicesClone);
  };

  const handleListItemChangeHelper = (
    item: string,
    checked: boolean,
    servicesClone: ClientService[]
  ) => {
    if (index === -1 && !checked) return;

    if (index === -1 && checked)
      return servicesClone.push({
        service: service.service,
        text: null,
        count: null,
        units: null,
        list: [item],
      });

    const serviceClone = servicesClone[index];
    const list = serviceClone.list;

    if (!list && checked) return (serviceClone.list = [item]);

    if (list && checked) return list.push(item);

    if (!list) return;

    const itemIndex = list.findIndex((string) => string === item);
    if (itemIndex !== -1) list.splice(itemIndex, 1);
    if (list.length === 0) servicesClone.splice(index, 1);
  };

  return (
    <>
      <SHSEHeader
        header={service.service}
        leftButton={<LLButton onClick={onBack}>←</LLButton>}
      />
      {service.inputType === "Textbox" && (
        <LLDebouncedAutoResizeTextarea
          value={getText()}
          onChange={handleTextChange}
          placeholder={"Description"}
          cols={30}
          autoFocus={true}
          twStyle={"m-2"}
        />
      )}
      {service.inputType === "Locations" && (
        <ul className="flex flex-col flex-nowrap justify-start items-stretch space-y-2 p-2 rounded-b-lg">
          {locationContext
            ?.getAllLocations(locationDocument)
            .map((location: string) => (
              <li
                key={location}
                className="flex flex-row flex-nowrap justify-between items-center space-x-4 bg-gray-800 rounded-lg text-cyan-300 p-2"
              >
                <p>{location}</p>
                <input
                  type={"checkbox"}
                  className="w-4 h-4"
                  checked={getList().includes(location)}
                  onChange={(event) =>
                    handleListItemChange(location, event.target.checked)
                  }
                />
              </li>
            ))}
        </ul>
      )}
      {service.inputType === "Custom List" && (
        <ul className="flex flex-col flex-nowrap justify-start items-stretch space-y-2 p-2 rounded-b-lg">
          {service.customList?.map((item: string) => (
            <li
              key={item}
              className="flex flex-row flex-nowrap justify-between items-center space-x-4 bg-gray-800 rounded-lg text-cyan-300 p-2"
            >
              <p>{item}</p>
              <input
                type={"checkbox"}
                className="w-4 h-4"
                checked={getList().includes(item)}
                onChange={(event) =>
                  handleListItemChange(item, event.target.checked)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SHSEService;
