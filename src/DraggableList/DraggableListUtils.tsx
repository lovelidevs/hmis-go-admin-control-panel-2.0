// TODO: Add unit tests
const findNestedObjectArray = (
  objectClone: any,
  indexes: number[],
  nestLevels: number,
  arrayPropNames: string[]
): object[] => {
  let array = objectClone[arrayPropNames[nestLevels]];

  let nestLevel = nestLevels - 1;
  for (let i = indexes.length - 1; i > 0; i--) {
    array = array[indexes[i]][arrayPropNames[nestLevel]];
    nestLevel--;
  }

  return array;
};

export const nestedArrayObjectModify = (
  object: any,
  modifyIndexes: number[],
  value: object,
  nestLevels: number,
  arrayPropNames: string[]
): any => {
  if (modifyIndexes.length === 0) return object;

  const objectClone = structuredClone(object);

  const array = findNestedObjectArray(
    objectClone,
    modifyIndexes,
    nestLevels,
    arrayPropNames
  );

  array[modifyIndexes[0]] = value;

  return objectClone;
};

export const nestedArrayObjectAdd = (
  object: any,
  insertIndexes: number[],
  nestLevels: number,
  arrayPropNames: string[],
  newDataFxs: (() => object)[]
) => {
  if (insertIndexes.length === 0) return object;

  const objectClone = structuredClone(object);
  const element = newDataFxs[nestLevels - insertIndexes.length + 1]();

  const array = findNestedObjectArray(
    objectClone,
    insertIndexes,
    nestLevels,
    arrayPropNames
  );

  array.splice(insertIndexes[0], 0, element);

  return objectClone;
};

export const nestedArrayObjectRemove = (
  object: any,
  removeIndexes: number[],
  nestLevels: number,
  arrayPropNames: string[],
  newDataFxs: (() => object)[]
) => {
  if (removeIndexes.length === 0) return object;

  const objectClone = structuredClone(object);
  const element = newDataFxs[nestLevels - removeIndexes.length + 1]();

  const array = findNestedObjectArray(
    objectClone,
    removeIndexes,
    nestLevels,
    arrayPropNames
  );

  array.splice(removeIndexes[0], 1);
  if (array.length === 0) array.push(element);

  return objectClone;
};

export const nestedArrayObjectSwap = (
  object: any,
  sourceIndexes: number[],
  targetIndexes: number[],
  nestLevels: number,
  arrayPropNames: string[]
) => {
  if (sourceIndexes.length === 0 || targetIndexes.length === 0) return object;

  const objectClone = structuredClone(object);

  const sourceArray = findNestedObjectArray(
    objectClone,
    sourceIndexes,
    nestLevels,
    arrayPropNames
  );

  const targetArray = findNestedObjectArray(
    objectClone,
    targetIndexes,
    nestLevels,
    arrayPropNames
  );

  targetArray.splice(
    targetIndexes[0],
    0,
    sourceArray.splice(sourceIndexes[0], 1)[0]
  );

  return objectClone;
};

export const updateIndexes = (
  list: HTMLUListElement,
  child: HTMLDivElement,
  indexes?: number[]
) => {
  const index = Array.from(list.children).indexOf(child);

  if (indexes) indexes.push(index);
  else indexes = [index];

  return indexes;
};

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
