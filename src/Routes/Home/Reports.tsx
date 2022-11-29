import { useContext, useEffect, useRef, useState } from "react";

import { CSVLink } from "react-csv";

import {
  generateReport,
  SERVICE_HISTORY,
  SERVICE_HISTORY_HEADERS,
} from "../../API/ReportProvider";
import { AuthContext } from "../../Authentication/AuthProvider";
import LLButton from "../../LLComponents/LLButton";
import LLLegendInput from "../../LLComponents/LLLegendInput";
import LLLegendSelect from "../../LLComponents/LLLegendSelect";
import LLOkDialog from "../../LLComponents/LLOkDialog";
import LLTable from "../../LLComponents/LLTable/LLTable";

const Reports = () => {
  const authContext = useContext(AuthContext);

  const [report, setReport] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [data, setData] = useState<string[][] | null>(null);

  const [dialogMessage, setDialogMessage] = useState<string>("");

  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => setData(null), [report]);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const handleGenerateReport = async () => {
    try {
      setData(
        await generateReport(
          authContext?.user,
          authContext?.userData?.organization,
          report,
          startDate,
          endDate
        )
      );
    } catch (error) {
      showDialog(String(error));
    }
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
          <LLButton type="button" onClick={handleGenerateReport}>
            Generate Report
          </LLButton>
          {data && (
            <CSVLink
              data={data}
              headers={SERVICE_HISTORY_HEADERS}
              filename={`${report} Report ${startDate} to ${endDate}`}
              className="text-black text-xl bg-cyan-300 rounded px-4 py-2 hover:bg-cyan-400"
            >
              ⭳
            </CSVLink>
          )}
        </div>
        {data && <LLTable headers={SERVICE_HISTORY_HEADERS} data={data} />}
      </main>
      <LLOkDialog ref={dialog} message={dialogMessage} />
    </>
  );
};

export default Reports;
