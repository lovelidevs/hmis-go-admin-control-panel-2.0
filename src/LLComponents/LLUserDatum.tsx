import { UserDatum } from "../API/UserDataProvider";
import LLLegendSelect from "./LLLegendSelect";
import LLDeleteButton from "./LLMenuButtons/LLDeleteButton";

const LLUserDatum = ({
  userDatum,
  onChange,
  onDelete,
}: {
  userDatum: UserDatum;
  onChange: (property: object) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-col flex-nowrap justify-start items-stretch rounded border border-cyan-300 p-2">
      <div className="flex flex-row flex-nowrap justify-between items-center space-x-4">
        <p>{userDatum.email}</p>
        <LLDeleteButton width={"w-6"} height={"h-6"} onClick={onDelete} />
      </div>
      <div className="flex flex-row flex-nowrap justify-between items-center space-x-4">
        <LLLegendSelect
          legend={"Role"}
          value={userDatum.role}
          onChange={(value: string) => onChange({ role: value })}
          options={["", "user", "admin"]}
        />
        <LLLegendSelect
          legend={"Status"}
          value={userDatum.status}
          onChange={(value: string) => onChange({ status: value })}
          options={["", "pending", "confirmed", "rejected"]}
        />
      </div>
    </div>
  );
};

export default LLUserDatum;
