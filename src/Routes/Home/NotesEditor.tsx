import { useContext } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { ObjectId } from "bson";
import omitDeep from "omit-deep-lodash";

import {
  DELETE_NOTE,
  LOAD_NOTES,
  Note,
  UPDATE_NOTE,
} from "../../API/NotesProvider";
import { AuthContext } from "../../Authentication/AuthProvider";
import LLAutosaveStatusBar from "../../LLComponents/LLAutosaveStatusBar";
import LLLoadingSpinner from "../../LLComponents/LLLoadingSpinner";
import LLNote from "../../LLComponents/LLNote";

const NotesEditor = () => {
  const authContext = useContext(AuthContext);

  const { loading, error, data } = useQuery(LOAD_NOTES, {
    variables: {
      organization: authContext?.userData?.organization,
    },
  });

  const [updateNote, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_NOTE);

  const [deleteNote, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_NOTE);

  const handleChange = (note: Note, content: string[]) => {
    const noteClone: Note = structuredClone(note);
    noteClone.content = content;
    updateNote({
      variables: {
        _id: note._id,
        note: omitDeep(noteClone, ["__typename"]),
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneNote: noteClone,
      },
    });
  };

  const handleDelete = (_id: ObjectId) =>
    deleteNote({
      variables: { _id: _id },
      refetchQueries: [LOAD_NOTES],
    });

  if (loading || error) {
    if (error) {
      console.log("Error loading notes:");
      console.log(error);
    }

    return <LLLoadingSpinner />;
  }

  // TEST THIS
  if (!data.notes) return <p>No Notes</p>;

  return (
    <main className="flex flex-col flex-nowrap justify-start items-center space-y-4 py-4">
      <LLAutosaveStatusBar
        updateLoading={updateLoading || deleteLoading}
        updateError={updateError || deleteError}
      />
      <ul className="flex flex-col flex-nowrap justify-start items-stretch space-y-6">
        {data.notes.map((note: Note) => (
          <li key={String(note._id)}>
            <LLNote
              note={note}
              onChange={(content: string[]) => handleChange(note, content)}
              onDelete={() => handleDelete(note._id)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default NotesEditor;
