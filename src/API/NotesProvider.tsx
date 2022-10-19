import { ReactNode } from "react";

import { ObjectId } from "bson";
import gql from "graphql-tag";

const NOTE_FRAGMENT = gql`
  fragment Note_note on Note {
    _id
    organization
    datetime
    content
  }
`;

export const LOAD_NOTES = gql`
  query LoadNotes($organization: String!) {
    notes(
      query: { organization: $organization }
      limit: 1000
      sortBy: DATETIME_DESC
    ) {
      ...Note_note
    }
  }
  ${NOTE_FRAGMENT}
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($_id: ObjectId, $note: NoteUpdateInput!) {
    updateOneNote(query: { _id: $_id }, set: $note) {
      ...Note_note
    }
  }
  ${NOTE_FRAGMENT}
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($_id: ObjectId) {
    deleteOneNote(query: { _id: $_id }) {
      _id
    }
  }
`;

export type Note = {
  _id: ObjectId;
  organization: string;
  datetime: Date;
  content: string[];
};

const NotesProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <>{children}</>;
};

export default NotesProvider;
