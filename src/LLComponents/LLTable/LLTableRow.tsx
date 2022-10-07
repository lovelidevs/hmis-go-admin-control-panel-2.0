import LLTableData from "./LLTableData";
import LLTableHeader from "./LLTableHeader";

const LLTableRow = ({
  section,
  headers,
  data,
}: {
  section: "head" | "body";
  headers?: string[];
  data?: string[];
}) => {
  switch (section) {
    case "head":
      return (
        <tr className="border-2 border-gray-400">
          {headers?.map((header, index) => (
            <LLTableHeader key={index}>{header}</LLTableHeader>
          ))}
        </tr>
      );
    case "body":
      return (
        <tr className="even:bg-gray-200">
          {data?.map((datum, index) => (
            <LLTableData
              key={index}
              textWrap={index === data.length - 1 ? true : false}
            >
              {datum}
            </LLTableData>
          ))}
        </tr>
      );
  }
};

export default LLTableRow;
