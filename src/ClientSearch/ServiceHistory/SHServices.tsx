import { useContext, useEffect, useState } from "react";

import { ClientContext, ClientService } from "../../API/ClientProvider";
import { ServiceContext } from "../../API/ServiceProvider";

const SHServices = ({
  defaultServices,
  disabled,
}: {
  defaultServices: ClientService[];
  disabled: boolean;
}) => {
  const clientContext = useContext(ClientContext);
  const serviceContext = useContext(ServiceContext);

  const [services, setServices] = useState<ClientService[]>(defaultServices);

  useEffect(() => {
    setServices(defaultServices);
  }, [defaultServices]);

  if (!clientContext || !serviceContext) return <p>Loading...</p>;

  if (disabled)
    return (
      <p className={services.length > 0 ? "" : "text-center"}>
        {services.length > 0 ? clientContext?.servicesToString(services) : "-"}
      </p>
    );

  if (services.length === 0)
    return (
      <div className="flex flex-row row-nowrap justify-center items-center">
        <div
          data-length={0}
          className="text-center bg-white hover:cursor-pointer py-1 px-8 border border-gray-800 rounded-lg"
        >
          -
        </div>
      </div>
    );

  return (
    <div
      data-length={services.length}
      className="flex flex-row flex-wrap justify-start items-baseline space-x-1 space-y-1"
    >
      {services.map((service) => (
        <p
          key={service.service}
          className="bg-white hover:cursor-pointer border border-gray-800 rounded-lg p-1"
        >
          {clientContext.serviceToString(service)}
        </p>
      ))}
    </div>
  );
};

export default SHServices;
