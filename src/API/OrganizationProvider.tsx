import { ObjectId } from "bson";
import gql from "graphql-tag";

export const LOAD_ORGANIZATIONS = gql`
  query LoadOrganizations {
    organizations(sortBy: ORGANIZATION_ASC) {
      _id
      organization
    }
  }
`;

export type organization = {
  _id: ObjectId;
  organization: string;
};

export const organizationsDataToOrganizations = (data: any): string[] => {
  if (!data) return [""];

  const organizations: string[] = (data.organizations as organization[]).map(
    (organization) => organization.organization
  );
  organizations.unshift("");

  return organizations;
};
