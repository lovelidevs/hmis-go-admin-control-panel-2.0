import { useContext, useEffect, useRef, useState } from "react";

import { ObjectId } from "bson";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CSVLink } from "react-csv";

import { AuthContext } from "../../Authentication/AuthProvider";
import LLButton from "../../LLComponents/LLButton";
import LLLegendInput from "../../LLComponents/LLLegendInput";
import LLLegendSelect from "../../LLComponents/LLLegendSelect";
import LLOkDialog from "../../LLComponents/LLOkDialog";
import LLTable from "../../LLComponents/LLTable/LLTable";

dayjs.extend(utc);

type AggregationPipelinePayloadResultItem = {
  _id: ObjectId;
  organization: string;
  lastName: string;
  firstName: string;
  alias?: string;
  hmisID?: string;
  serviceHistory: {
    date: string;
    time?: string;
    city?: string;
    locationCategory?: string;
    location?: string;
    services?: {
      service: string;
      text?: string;
      count?: number;
      units?: string;
      list?: string[];
    }[];
  };
};

type AggregationPipelinePayload = {
  result: AggregationPipelinePayloadResultItem[];
  error: string;
};

const SERVICE_HISTORY = "Service History";

const Reports = () => {
  const authContext = useContext(AuthContext);

  const [report, setReport] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [data, setData] = useState<string[][] | null>(null);
  const headers = useRef<string[]>([
    "Date",
    "Time",
    "Location",
    "Client",
    "Services",
  ]);

  const [dialogMessage, setDialogMessage] = useState<string>("");

  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => setData(null), [report]);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const generateReport = async () => {
    if (!report) return showDialog("No report selected");

    if (!startDate) return showDialog("Start date is missing or invalid");
    if (!endDate) return showDialog("End date is missing or invalid");

    if (!authContext?.user) return showDialog("User is null");

    const organization = authContext.userData?.organization;
    if (!organization) return showDialog("Organization is null");

    try {
      if (report === SERVICE_HISTORY) {
        const payload: AggregationPipelinePayload =
          await authContext.user.callFunction("serviceHistoryReport", [
            organization,
            startDate,
            endDate,
          ]);

        if (payload.error) return showDialog(String(payload.error));

        return setData(pipelineResultToData(payload.result));
      }
    } catch (error) {
      return showDialog(String(error));
    }
  };

  const timeStringFromPipelineItem = (
    item: AggregationPipelinePayloadResultItem
  ) => {
    if (!item.serviceHistory.time) return "";
    return dayjs.utc(item.serviceHistory.time).local().format("h:mm A");
  };

  const clientStringFromPipelineItem = (
    item: AggregationPipelinePayloadResultItem
  ) => {
    let result = item.lastName + " " + item.firstName;

    if (item.alias) result += " (" + item.alias + ")";
    if (item.hmisID) result += " " + item.hmisID;

    return result;
  };

  const servicesStringFromPipelineItem = (
    item: AggregationPipelinePayloadResultItem
  ) => {
    if (!item.serviceHistory.services) return "";

    let result: string[] = [];

    for (const service of item.serviceHistory.services) {
      let element = service.service;

      if (service.text) element += " (" + service.text + ")";

      if (service.count && service.units)
        element += ` (${service.count} ${service.units})`;

      if (service.list) element += " (" + service.list.join(", ") + ")";

      result.push(element);
    }

    return result.join(", ");
  };

  const pipelineResultToData = (
    result: AggregationPipelinePayloadResultItem[]
  ): string[][] => {
    const resultData: string[][] = [];

    let index = 0;
    for (const item of result) {
      const date = item.serviceHistory.date;

      const time = timeStringFromPipelineItem(item);

      const location = item.serviceHistory.location
        ? item.serviceHistory.location
        : "";

      const client = clientStringFromPipelineItem(item);

      const services = servicesStringFromPipelineItem(item);

      resultData[index] = [date, time, location, client, services];
      index++;
    }

    return resultData;
  };

  return (
    <>
      <main className="flex flex-col justify-start items-center space-y-4 mt-4">
        <LLLegendSelect
          legend="select report"
          value={report}
          onChange={(value) => setReport(value)}
          options={["", SERVICE_HISTORY]}
        />
        <div className="flex flex-row justify-center items-stretch space-x-4">
          <LLLegendInput
            legend="start date"
            type="date"
            value={startDate}
            onChange={(value) => setStartDate(value)}
          />
          <LLLegendInput
            legend="end date"
            type="date"
            value={endDate}
            onChange={(value) => setEndDate(value)}
          />
        </div>
        <div className="flex flex-row flex-nowrap justify-center items-stretch space-x-4 pt-2">
          <LLButton type="button" onClick={generateReport}>
            Generate Report
          </LLButton>
          {data && (
            <CSVLink
              data={data}
              headers={headers.current}
              filename={`${report} Report ${startDate} to ${endDate}`}
              className="text-black text-xl bg-cyan-300 rounded px-4 py-2 hover:bg-cyan-400"
            >
              ⭳
            </CSVLink>
          )}
        </div>
        {data && <LLTable headers={headers.current} data={data} />}
      </main>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default Reports;
