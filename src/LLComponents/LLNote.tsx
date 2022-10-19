import dayjs from "dayjs";

import { Note } from "../API/NotesProvider";
import LLDebouncedAutoResizeTextarea from "./LLDebouncedAutoResizeTextarea";
import LLDeleteButton from "./LLMenuButtons/LLDeleteButton";

const LLNote = ({
  note,
  onChange,
  onDelete,
}: {
  note: Note;
  onChange: (content: string[]) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-col flex-nowrap justify-start items-stretch space-y-2 rounded-lg border border-cyan-300 p-3">
      <div className="flex flex-row justify-between items-center">
        <p>{dayjs(note.datetime).format("MMMM D, YYYY - h:mm A")}</p>
        <LLDeleteButton width={"w-6"} height={"h-6"} onClick={onDelete} />
      </div>
      <LLDebouncedAutoResizeTextarea
        value={note.content}
        onChange={onChange}
        cols={50}
      />
    </div>
  );
};

export default LLNote;
