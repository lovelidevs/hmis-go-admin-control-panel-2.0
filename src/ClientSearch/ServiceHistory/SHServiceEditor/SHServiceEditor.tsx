import React, { useEffect, useState } from "react";

import { ClientService } from "../../../API/ClientProvider";
import { LocationDocument } from "../../../API/LocationProvider";
import {
  ServiceCategoryData,
  ServiceData,
  ServiceDocument,
} from "../../../API/ServiceProvider";
import SHSECategory from "./SHSECategory";
import SHSECategorySelect from "./SHSECategorySelect";
import SHSEService from "./SHSEService";

type SHServiceEditorProps = {
  serviceDocument: ServiceDocument;
  locationDocument: LocationDocument;
  services: ClientService[];
  onChange: (servicesClone: ClientService[]) => void;
};

const SHServiceEditor = React.forwardRef<
  HTMLDialogElement,
  SHServiceEditorProps
>(({ serviceDocument, locationDocument, services, onChange }, ref) => {
  const [categoryUUID, setCategoryUUID] = useState<string | null>(null);
  const [category, setCategory] = useState<ServiceCategoryData | null>(null);

  const [serviceUUID, setServiceUUID] = useState<string | null>(null);
  const [service, setService] = useState<ServiceData | null>(null);

  useEffect(() => {
    if (!categoryUUID) return setCategory(null);

    const result = serviceDocument.categories.find(
      (category) => category.uuid === categoryUUID
    );

    setCategory(result ? result : null);
  }, [categoryUUID, serviceDocument.categories]);

  useEffect(() => {
    if (!categoryUUID || !serviceUUID) return setService(null);

    const result = serviceDocument.categories
      .find((categoryObj) => categoryObj.uuid === categoryUUID)
      ?.services.find((serviceObj) => serviceObj.uuid === serviceUUID);

    setService(result ? result : null);
  }, [categoryUUID, serviceDocument.categories, serviceUUID]);

  return (
    <dialog ref={ref} className="rounded-lg">
      <form
        method="dialog"
        className="flex flex-col flex-nowrap justify-start items-stretch border border-gray-800 rounded-lg"
        onSubmit={() => {
          setCategoryUUID(null);
          setServiceUUID(null);
        }}
      >
        {!categoryUUID && (
          <SHSECategorySelect
            categories={serviceDocument.categories}
            onSelect={(uuid: string) => setCategoryUUID(uuid)}
          />
        )}
        {categoryUUID && !serviceUUID && category && (
          <SHSECategory
            category={category}
            services={services}
            onBack={() => setCategoryUUID(null)}
            onChange={onChange}
            onSelect={(uuid: string) => setServiceUUID(uuid)}
          />
        )}
        {categoryUUID && serviceUUID && service && (
          <SHSEService
            service={service}
            services={services}
            locationDocument={locationDocument}
            onChange={onChange}
            onBack={() => setServiceUUID(null)}
          />
        )}
      </form>
    </dialog>
  );
});

export default SHServiceEditor;
