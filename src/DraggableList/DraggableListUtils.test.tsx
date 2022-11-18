import { ObjectId } from "bson";

import {
  ServiceCategoryData,
  ServiceData,
  ServiceDocument,
} from "../API/ServiceProvider";
import { SERVICE_ARRAY_PROP_NAMES } from "../Routes/Home/ServiceEditor";
import {
  findNestedObjectArray,
  updateIndexes,
  capitalize,
} from "./DraggableListUtils";

test('capitalize ""', () => expect(capitalize("")).toBe(""));
test('capitalize "test"', () => expect(capitalize("test")).toBe("Test"));
test('capitalize "Test"', () => expect(capitalize("Test")).toBe("Test"));

const child = document.createElement("div");

const list = document.createElement("ul");
list.appendChild(child);

test("updateIndexes #1", () => expect(updateIndexes(list, child)).toEqual([0]));
test("updateIndexes #2", () =>
  expect(updateIndexes(list, child, [])).toEqual([0]));
test("updateIndexes #3", () =>
  expect(updateIndexes(list, child, [5])).toEqual([5, 0]));

const child2 = document.createElement("div");

const list2 = document.createElement("ul");
list2.appendChild(child2);
list2.insertBefore(document.createElement("div"), child2);
list2.appendChild(document.createElement("div"));

test("updateIndexes #4", () =>
  expect(updateIndexes(list2, child2)).toEqual([1]));

/* * * findNestedObjectArray * * */

const services: ServiceData[] = [
  {
    uuid: "0",
    service: "VI-SPDAT",
    inputType: "Toggle",
  },
];

const categories: ServiceCategoryData[] = [
  {
    uuid: "0",
    category: "Coordinated Entry",
    services: [],
  },
  {
    uuid: "1",
    category: "Transportation",
    services,
  },
  {
    uuid: "2",
    category: "Mediation",
    services: [],
  },
];

const object: ServiceDocument = {
  _id: new ObjectId(),
  organization: "DEMO",
  categories,
};

test("findNestedObjectArray #0", () =>
  expect(
    findNestedObjectArray(object, [0], 1, SERVICE_ARRAY_PROP_NAMES)
  ).toEqual(categories));

test("findNestedObjectArray #1", () =>
  expect(
    findNestedObjectArray(object, [0, 1], 1, SERVICE_ARRAY_PROP_NAMES)
  ).toEqual(services));

/* * * nestedArrayObjectModify * * */
/* * * nestedArrayObjectAdd * * */
/* * * nestedArrayObjectRemove * * */
/* * * nestedArrayObjectSwap * * */

// ReferenceError: structuredClone is not defined
