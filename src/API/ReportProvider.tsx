import { ObjectId } from "bson";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as Realm from "realm-web";

dayjs.extend(utc);

export const SERVICE_HISTORY = "Service History";

export const SERVICE_HISTORY_HEADERS: string[] = [
  "Date",
  "Time",
  "Location",
  "Client",
  "Services",
];

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

export const generateReport = async (
  user: Realm.User | null | undefined,
  organization: string | undefined,
  report: string,
  startDate: string,
  endDate: string
): Promise<string[][]> => {
  if (!user) throw new Error("User is null");
  if (!organization) throw new Error("Organization is null");
  if (!report) throw new Error("No report selected");
  if (!startDate) throw new Error("Start date is missing or invalid");
  if (!endDate) throw new Error("End date is missing or invalid");

  try {
    if (report === SERVICE_HISTORY) {
      const payload: AggregationPipelinePayload = await user.callFunction(
        "serviceHistoryReport",
        [organization, startDate, endDate]
      );

      if (payload.error) throw payload.error;
      return pipelineResultToData(payload.result);
    }
  } catch (error) {
    throw error;
  }

  return [];
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
