import { useRef, useState } from "react";

import isEqual from "lodash.isequal";

import DraggableListElement from "./DraggableListElement";
import {
  nestedArrayObjectAdd,
  nestedArrayObjectModify,
  nestedArrayObjectRemove,
  nestedArrayObjectSwap,
  updateIndexes,
} from "./DraggableListUtils";

const DraggableList = ({
  data,
  nestLevels,
  dataPropNames,
  arrayPropNames,
  newDataFxs,
  updateFx,
  renderFx,
}: {
  data: any;
  nestLevels: number;
  dataPropNames: string[];
  arrayPropNames: string[];
  newDataFxs: (() => object)[];
  updateFx: (data: any) => void;
  renderFx: (data: any, onModify: (value: object) => void) => JSX.Element;
}): JSX.Element => {
  const [dragItemIndexes, setDragItemIndexes] = useState<number[]>([]);
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  const uList = useRef<HTMLUListElement>(null);
  const isAdding = useRef<boolean>(false);

  const handleModify = (
    child: HTMLDivElement,
    value: object,
    modifyIndexes?: number[]
  ) => {
    if (!uList.current) return;

    modifyIndexes = updateIndexes(uList.current, child, modifyIndexes);

    updateFx(
      nestedArrayObjectModify(
        data,
        modifyIndexes,
        value,
        nestLevels,
        arrayPropNames
      )
    );
  };

  const handleAdd = (child: HTMLDivElement, insertIndexes?: number[]) => {
    if (!uList.current) return;
    isAdding.current = true;

    insertIndexes = updateIndexes(uList.current, child, insertIndexes);
    if (insertIndexes.length === 1) insertIndexes[0]++;

    updateFx(
      nestedArrayObjectAdd(
        data,
        insertIndexes,
        nestLevels,
        arrayPropNames,
        newDataFxs
      )
    );

    setActiveIndexes(insertIndexes);
  };

  const handleRemove = (child: HTMLDivElement, removeIndexes?: number[]) => {
    if (!uList.current) return;

    removeIndexes = updateIndexes(uList.current, child, removeIndexes);

    updateFx(
      nestedArrayObjectRemove(
        data,
        removeIndexes,
        nestLevels,
        arrayPropNames,
        newDataFxs
      )
    );
  };

  const handleActivate = (
    child: HTMLDivElement,
    activatedIndexes?: number[]
  ) => {
    if (isAdding.current) {
      isAdding.current = false;
      return;
    }

    if (!uList.current) return;
    activatedIndexes = updateIndexes(uList.current, child, activatedIndexes);
    setActiveIndexes(activatedIndexes);
  };

  const handleDragStart = (child: HTMLDivElement, dragIndexes?: number[]) => {
    if (!uList.current) return;

    dragIndexes = updateIndexes(uList.current, child, dragIndexes);

    setDragItemIndexes(dragIndexes);
    setActiveIndexes(dragIndexes);
  };

  const handleDragEnd = () => setDragItemIndexes([]);

  const handleDragEnter = (
    child: HTMLDivElement,
    dropZoneIndexes?: number[]
  ) => {
    if (!uList.current) return;

    dropZoneIndexes = updateIndexes(uList.current, child, dropZoneIndexes);

    if (dropZoneIndexes.length !== dragItemIndexes.length) return;
    if (isEqual(dropZoneIndexes, dragItemIndexes)) return;

    updateFx(
      nestedArrayObjectSwap(
        data,
        dragItemIndexes,
        dropZoneIndexes,
        nestLevels,
        arrayPropNames
      )
    );

    setDragItemIndexes(dropZoneIndexes);
    setActiveIndexes(dropZoneIndexes);
  };

  const filterIndexes = (indexes: number[], childIndex: number) => {
    if (indexes.length === 0 || indexes[indexes.length - 1] !== childIndex)
      return [];
    return indexes;
  };

  return (
    <ul
      ref={uList}
      className="flex flex-col flex-nowrap justify-start items-center space-y-2"
    >
      {data[arrayPropNames[nestLevels]].map(
        (childData: { uuid: string; [key: string]: any }, index: number) => (
          <DraggableListElement
            key={childData.uuid}
            data={childData}
            nestLevel={nestLevels}
            dataPropNames={dataPropNames}
            arrayPropNames={arrayPropNames}
            dragItemIndexes={filterIndexes(dragItemIndexes, index)}
            activeIndexes={filterIndexes(activeIndexes, index)}
            renderFx={renderFx}
            onModify={handleModify}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onActivate={handleActivate}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
          />
        )
      )}
    </ul>
  );
};

export default DraggableList;
