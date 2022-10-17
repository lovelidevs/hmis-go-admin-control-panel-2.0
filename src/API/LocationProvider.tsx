import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import { ObjectId } from "bson";
import gql from "graphql-tag";
import { v4 as uuidv4 } from "uuid";

import { AuthContext } from "../Authentication/AuthProvider";
import { ApolloClientContext } from "./ApolloClientProvider";

const LOAD_LOCATION_DOCUMENT_ID = gql`
  query LoadLocationDocumentId($organization: String!) {
    location(query: { organization: $organization }) {
      _id
    }
  }
`;

const INSERT_LOCATION_DOCUMENT = gql`
  mutation InsertLocationDocument($location: LocationInsertInput!) {
    insertOneLocation(data: $location) {
      _id
    }
  }
`;

const locationFragment = gql`
  fragment Location_location on Location {
    _id
    cities {
      uuid
      city
      categories {
        uuid
        category
        locations {
          uuid
          location
          places
        }
      }
    }
  }
`;

export const LOAD_LOCATION_DOCUMENT = gql`
  query LoadLocationDocument($_id: ObjectId!) {
    location(query: { _id: $_id }) {
      ...Location_location
    }
  }
  ${locationFragment}
`;

export const UPDATE_LOCATION_DOCUMENT = gql`
  mutation UpdateLocationDocument(
    $_id: ObjectId!
    $location: LocationUpdateInput!
  ) {
    updateOneLocation(query: { _id: $_id }, set: $location) {
      ...Location_location
    }
  }
  ${locationFragment}
`;

export type LocationDocument = {
  __typename?: string;
  _id: ObjectId;
  organization: string;
  cities: LocationCityData[];
};

type LocationCityData = {
  __typename?: string;
  uuid: string;
  city: string;
  categories: LocationCategoryData[];
};

type LocationCategoryData = {
  __typename?: string;
  uuid: string;
  category: string;
  locations: LocationData[];
};

export type LocationData = {
  __typename?: string;
  uuid: string;
  location: string;
  places?: string[] | null;
};

type LocationContextType = {
  locationDocumentId: ObjectId | null;
  newLocationData: () => LocationData;
  newLocationCategoryData: () => LocationCategoryData;
  newLocationCityData: () => LocationCityData;
  getCities: (locationDocument: LocationDocument) => string[];
  getLocationCategories: (
    locationDocument: LocationDocument,
    city: string
  ) => string[];
  getLocations: (
    locationDocument: LocationDocument,
    city: string,
    locationCategory: string
  ) => string[];
};

export const LocationContext = React.createContext<LocationContextType | null>(
  null
);

const LocationProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const authContext = useContext(AuthContext);
  const apolloClientContext = useContext(ApolloClientContext);

  const [locationDocumentId, setLocationDocumentId] = useState<ObjectId | null>(
    null
  );

  const [loadLocationDocumentId] = useLazyQuery(LOAD_LOCATION_DOCUMENT_ID);
  const [insertLocationDocument] = useMutation(INSERT_LOCATION_DOCUMENT);

  const newLocationData = useCallback((): LocationData => {
    return {
      uuid: uuidv4(),
      location: "",
      places: null,
    };
  }, []);

  const newLocationCategoryData = useCallback((): LocationCategoryData => {
    return {
      uuid: uuidv4(),
      category: "",
      locations: [newLocationData()],
    };
  }, [newLocationData]);

  const newLocationCityData = useCallback((): LocationCityData => {
    return {
      uuid: uuidv4(),
      city: "",
      categories: [newLocationCategoryData()],
    };
  }, [newLocationCategoryData]);

  useEffect(() => {
    if (!authContext?.user) return setLocationDocumentId(null);
    if (!authContext.userData?.organization) return setLocationDocumentId(null);
    if (!apolloClientContext?.client) return setLocationDocumentId(null);

    loadLocationDocumentId({
      variables: { organization: authContext.userData.organization },
      onCompleted: (data) => {
        if (data.location)
          return setLocationDocumentId((data.location as LocationDocument)._id);

        insertLocationDocument({
          variables: {
            location: {
              organization: authContext.userData?.organization,
              cities: [newLocationCityData()],
            },
          },
          onCompleted: (data) =>
            setLocationDocumentId(
              (data.insertOneLocation as LocationDocument)._id
            ),
          onError: (error) => {
            console.log("Error inserting location document:");
            console.log(error);
          },
        });
      },
      onError: (error) => {
        console.log("Error loading location document _id:");
        console.log(error);
      },
    });
  }, [
    authContext?.user,
    authContext?.userData?.organization,
    apolloClientContext?.client,
    loadLocationDocumentId,
    insertLocationDocument,
    newLocationCityData,
  ]);

  const getCities = useCallback(
    (locationDocument: LocationDocument): string[] => {
      if (!locationDocument) return [];

      const cities: string[] = [];

      for (const city of locationDocument.cities) {
        cities.push(city.city);
      }

      return cities;
    },
    []
  );

  const getLocationCategories = useCallback(
    (locationDocument: LocationDocument, city: string): string[] => {
      if (!locationDocument) return [];

      const categories: string[] = [];

      const categoryObjs = locationDocument.cities.find(
        (cityObj) => cityObj.city === city
      )?.categories;

      if (!categoryObjs) return [];

      for (const category of categoryObjs) {
        categories.push(category.category);
      }

      return categories;
    },
    []
  );

  const getLocations = useCallback(
    (
      locationDocument: LocationDocument,
      city: string,
      locationCategory: string
    ): string[] => {
      if (!locationDocument) return [];

      const locations: string[] = [];

      const locationObjs = locationDocument.cities
        .find((cityObj) => cityObj.city === city)
        ?.categories.find(
          (category) => category.category === locationCategory
        )?.locations;

      if (!locationObjs) return [];

      for (const location of locationObjs) {
        locations.push(location.location);
        if (!location.places) continue;
        for (const place of location.places)
          locations.push(location.location + ": " + place);
      }

      return locations;
    },
    []
  );

  return (
    <LocationContext.Provider
      value={{
        locationDocumentId,
        newLocationData,
        newLocationCategoryData,
        newLocationCityData,
        getCities,
        getLocationCategories,
        getLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
