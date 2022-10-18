import { useContext, useEffect, useRef, useState } from "react";

import { ClientContext, ClientService } from "../../API/ClientProvider";
import { ServiceContext, ServiceDocument } from "../../API/ServiceProvider";
import SHServiceEditor from "./SHServiceEditor/SHServiceEditor";

const SHServices = ({
  serviceDocument,
  defaultServices,
  disabled,
}: {
  serviceDocument: ServiceDocument;
  defaultServices: ClientService[];
  disabled: boolean;
}) => {
  const clientContext = useContext(ClientContext);
  const serviceContext = useContext(ServiceContext);

  const [services, setServices] = useState<ClientService[]>(defaultServices);

  const serviceEditor = useRef<HTMLDialogElement>(null);

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
      <>
        <div className="flex flex-row row-nowrap justify-center items-center">
          <p
            data-length={0}
            className="text-center bg-white hover:cursor-pointer py-1 px-8 border border-gray-800 rounded-lg"
            onClick={() => {
              if (!serviceEditor.current?.open)
                serviceEditor.current?.showModal();
            }}
          >
            -
          </p>
        </div>
        <SHServiceEditor ref={serviceEditor} services={services} />
      </>
    );

  return (
    <>
      <div
        data-length={services.length}
        className="flex flex-row flex-wrap justify-start items-baseline space-x-1 space-y-1"
      >
        {services.map((service) => (
          <p
            key={service.service}
            data-service={service.service}
            data-text={service.text ? service.text : undefined}
            data-count={service.count ? service.count : undefined}
            data-units={service.units ? service.units : undefined}
            data-list={service.list ? service.list.join(",") : undefined}
            className="bg-white hover:cursor-pointer border border-gray-800 rounded-lg p-1"
            onClick={() => {
              if (!serviceEditor.current?.open)
                serviceEditor.current?.showModal();
            }}
          >
            {clientContext.serviceToString(service)}
          </p>
        ))}
      </div>
      <SHServiceEditor ref={serviceEditor} services={services} />
    </>
  );
};

export default SHServices;
