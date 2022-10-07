import LLTableRow from "./LLTableRow";

const LLTable = ({
  headers,
  data,
}: {
  headers: string[];
  data: string[][];
}) => {
  return (
    <table className="border-collapse border-b-2 border-gray-400 m-4">
      <thead>
        <LLTableRow section="head" headers={headers} />
      </thead>
      <tbody>
        {data.map((row, index) => (
          <LLTableRow key={index} section="body" data={row} />
        ))}
      </tbody>
    </table>
  );
};

export default LLTable;
