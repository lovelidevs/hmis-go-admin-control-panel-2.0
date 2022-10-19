import { useContext, useEffect, useRef, useState } from "react";

import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Client, ClientContact, ClientContext } from "../../API/ClientProvider";
import {
  LOAD_LOCATION_DOCUMENT,
  LocationContext,
} from "../../API/LocationProvider";
import {
  LOAD_SERVICE_DOCUMENT,
  ServiceContext,
} from "../../API/ServiceProvider";
import LLButton from "../../LLComponents/LLButton";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";
import SHDate from "./SHDate";
import SHLocation from "./SHLocation";
import SHServices from "./SHServices";
import SHTime from "./SHTime";

dayjs.extend(utc);

const ServiceHistory = ({ client }: { client: Client }) => {
  const clientContext = useContext(ClientContext);
  const serviceContext = useContext(ServiceContext);
  const locationContext = useContext(LocationContext);

  const [clientSH, setClientSH] = useState<Client>(client);
  const [disabled, setDisabled] = useState<boolean>(true);

  const tableBody = useRef<HTMLTableSectionElement>(null);

  // TODO: Still running into issues where there is no locationDocumentId
  const {
    loading: servicesLoading,
    error: servicesError,
    data: serviceData,
    refetch: refetchServices,
  } = useQuery(LOAD_SERVICE_DOCUMENT, {
    variables: { _id: serviceContext?.serviceDocumentId },
  });

  const {
    loading: locationsLoading,
    error: locationsError,
    data: locationData,
    refetch: refetchLocations,
  } = useQuery(LOAD_LOCATION_DOCUMENT, {
    variables: { _id: locationContext?.locationDocumentId },
  });

  useEffect(() => {
    if (serviceContext?.serviceDocumentId) refetchServices();
  }, [serviceContext?.serviceDocumentId, refetchServices]);

  useEffect(() => {
    if (locationContext?.locationDocumentId) refetchLocations();
  }, [locationContext?.locationDocumentId, refetchLocations]);

  const trKey = (contact: ClientContact, index: number) => {
    return contact.date + contact.time + contact.location + index;
  };

  if (!clientContext) return <p>Loading service history...</p>;

  const handleSave = () => {
    if (!tableBody.current) return console.log("No table body reference");

    const serviceHistory: ClientContact[] = [];

    for (let tr of tableBody.current.children) {
      const date = handleDate(
        tr.children[0].firstElementChild as HTMLInputElement
      );

      const time = handleTime(
        tr.children[1].firstElementChild as HTMLInputElement,
        date
      );

      const { city, locationCategory, location } = handleLocation(
        tr.children[2].firstElementChild as HTMLParagraphElement
      );

      serviceHistory.push({
        date,
        time,
        city,
        locationCategory,
        location,
        services: null,
      });
    }

    console.log(serviceHistory);

    setDisabled(true);
    // TODO: Do the actual save, reload, and then reset the table
  };

  const handleDate = (input: HTMLInputElement) => input.value;

  const handleTime = (input: HTMLInputElement, date: string) => {
    const time = input.value;
    if (!date || !time) return "";

    return dayjs(date + " " + time, "YYYY-MM-DD HH:mm")
      .utc()
      .toISOString();
  };

  const handleLocation = (element: HTMLParagraphElement) => {
    const city = element.dataset.city ? element.dataset.city : "";

    const locationCategory = element.dataset.locationcategory
      ? element.dataset.locationcategory
      : "";

    const location = element.dataset.location ? element.dataset.location : "";

    return { city, locationCategory, location };
  };

  // TODO: Sort correctly
  // TODO: Cancel button based on disabled

  const handleCancel = () => {
    setDisabled(true);
    setClientSH(client);
  };

  if (servicesLoading || locationsLoading) return <LLLoadingSpinner />;

  if (servicesError) return <p>{String(servicesError)}</p>;
  if (locationsError) return <p>{String(locationsError)}</p>;

  return (
    <div className="flex flex-col flex-nowrap justify-start items-stretch space-y-4">
      <div className="flex flex-row flex-nowrap justify-between items-center bg-gray-300 rounded-lg p-2">
        {disabled ? (
          <LLButton type="button" twStyle="invisible">
            Edit
          </LLButton>
        ) : (
          <LLButton type="button" onClick={handleSave}>
            Save
          </LLButton>
        )}
        <h2 className="text-xl font-bold">Service History</h2>
        {disabled ? (
          <LLButton type="button" onClick={() => setDisabled(false)}>
            Edit
          </LLButton>
        ) : (
          <LLButton type="button" onClick={handleCancel}>
            Cancel
          </LLButton>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Services</th>
          </tr>
        </thead>
        <tbody ref={tableBody}>
          {clientSH.serviceHistory?.map((contact, index) => (
            <tr key={trKey(contact, index)}>
              <td>
                <SHDate defaultValue={contact.date} disabled={disabled} />
              </td>
              <td>
                <SHTime
                  defaultValue={contact.time ? contact.time : ""}
                  disabled={disabled}
                />
              </td>
              <td>
                <SHLocation
                  locationDocument={locationData.location}
                  defaultCity={contact.city ? contact.city : ""}
                  defaultLocationCategory={
                    contact.locationCategory ? contact.locationCategory : ""
                  }
                  defaultLocation={contact.location ? contact.location : ""}
                  disabled={disabled}
                />
              </td>
              <td>
                <SHServices
                  serviceDocument={serviceData.service}
                  locationDocument={locationData.location}
                  defaultServices={contact.services ? contact.services : []}
                  disabled={disabled}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceHistory;
