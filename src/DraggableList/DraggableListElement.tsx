import {
  DragEventHandler,
  MouseEventHandler,
  ReactNode,
  useRef,
  useState,
} from "react";

import LLDebouncedInput from "../LLComponents/LLDebouncedInput";
import LLMenuButtons from "../LLComponents/LLMenuButtons/LLMenuButtons";
import DragBar from "./DragBar";
import { capitalize, updateIndexes } from "./DraggableListUtils";

const DraggableListElement = ({
  data,
  nestLevel,
  dataPropNames,
  arrayPropNames,
  dragItemIndexes,
  activeIndexes,
  renderFx,
  customButtonStatusInitFx,
  customButton,
  onModify,
  onAdd,
  onRemove,
  onActivate,
  onDragStart,
  onDragEnd,
  onDragEnter,
}: {
  data: any;
  nestLevel: number;
  dataPropNames: string[];
  arrayPropNames: string[];
  dragItemIndexes: number[];
  activeIndexes: number[];
  renderFx: (
    data: any,
    onModify: (value: object) => void,
    customButtonStatus?: boolean
  ) => JSX.Element;
  customButtonStatusInitFx?: (data: any, nestLevel: number) => boolean;
  customButton?: ReactNode;
  onModify: (
    child: HTMLDivElement,
    value: object,
    modifyIndexes?: number[]
  ) => void;
  onAdd: (child: HTMLDivElement, insertIndexes?: number[]) => void;
  onRemove: (child: HTMLDivElement, removeIndexes?: number[]) => void;
  onActivate: (child: HTMLDivElement, activatedIndexes?: number[]) => void;
  onDragStart: (child: HTMLDivElement, dragIndexes?: number[]) => void;
  onDragEnd: () => void;
  onDragEnter: (child: HTMLDivElement, dropZoneIndexes?: number[]) => void;
}): JSX.Element => {
  const [customButtonStatus, setCustomButtonStatus] = useState<boolean>(
    customButtonStatusInitFx ? customButtonStatusInitFx(data, nestLevel) : false
  );

  const component = useRef<HTMLDivElement>(null);
  const dragImage = useRef<HTMLDivElement>(null);
  const uList = useRef<HTMLUListElement>(null);

  const handleCategoryModify = (value: string) => {
    if (!component.current) return;

    onModify(component.current, {
      ...structuredClone(data),
      [dataPropNames[nestLevel]]: value,
    });
  };

  const handleItemModify = (value: object) => {
    if (!component.current) return;
    onModify(component.current, value);
  };

  const handleActivate: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    if (!component.current) return;
    onActivate(component.current);
  };

  const handleChildActivate = (
    child: HTMLDivElement,
    activatedIndexes?: number[]
  ) => {
    if (!component.current || !uList.current) return;
    activatedIndexes = updateIndexes(uList.current, child, activatedIndexes);
    onActivate(component.current, activatedIndexes);
  };

  /* Drag and Drop: Self */

  const handleDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();

    if (!component.current || !dragImage.current) return;

    event.dataTransfer.dropEffect = "move";

    const dragImageRect = dragImage.current.getBoundingClientRect();
    event.dataTransfer.setDragImage(
      dragImage.current,
      (event.clientX - dragImageRect.left) * window.devicePixelRatio,
      (event.clientY - dragImageRect.top) * window.devicePixelRatio
    );

    onDragStart(component.current);
  };

  const handleDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    onDragEnd();
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();

    if (!component.current) return;
    onDragEnter(component.current);
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /* Child Props */

  const handleModify = (
    child: HTMLDivElement,
    value: object,
    modifyIndexes?: number[]
  ) => {
    if (!component.current || !uList.current) return;

    modifyIndexes = updateIndexes(uList.current, child, modifyIndexes);
    onModify(component.current, value, modifyIndexes);
  };

  const handleAdd = (child: HTMLDivElement, insertIndexes?: number[]) => {
    if (!component.current || !uList.current) return;

    insertIndexes = updateIndexes(uList.current, child, insertIndexes);
    if (insertIndexes.length === 1) insertIndexes[0]++;

    onAdd(component.current, insertIndexes);
  };

  const handleRemove = (child: HTMLDivElement, removeIndexes?: number[]) => {
    if (!component.current || !uList.current) return;

    removeIndexes = updateIndexes(uList.current, child, removeIndexes);
    onRemove(component.current, removeIndexes);
  };

  const handleChildDragStart = (
    child: HTMLDivElement,
    dragIndexes?: number[]
  ) => {
    if (!component.current || !uList.current) return;

    dragIndexes = updateIndexes(uList.current, child, dragIndexes);
    onDragStart(component.current, dragIndexes);
  };

  const handleChildDragEnter = (
    child: HTMLDivElement,
    dropZoneIndexes?: number[]
  ) => {
    if (!component.current || !uList.current) return;

    dropZoneIndexes = updateIndexes(uList.current, child, dropZoneIndexes);
    onDragEnter(component.current, dropZoneIndexes);
  };

  const filterIndexes = (indexes: number[], childIndex: number) => {
    if (indexes.length < 2 || indexes[indexes.length - 2] !== childIndex)
      return [];

    const indexesCopy = [...indexes];
    indexesCopy.splice(-1);
    return indexesCopy;
  };

  return (
    <div
      ref={component}
      className="flex flex-row flex-nowrap justify-center items-start space-x-2 pl-6 pr-2"
      onClick={handleActivate}
    >
      <div
        className={`flex flex-col flex-nowrap justify-start items-stretch rounded-xl space-y-2 mb-2 ${
          nestLevel === 1 && "bg-white border-l-8"
        } ${nestLevel === 1 && activeIndexes.length === 0 && "border-white"} ${
          nestLevel === 1 && activeIndexes.length > 0 && "border-cyan-300"
        } ${nestLevel === 2 && "bg-gray-800"}`}
      >
        <div
          ref={dragImage}
          className={`flex flex-col flex-nowrap justify-start items-stretch rounded-lg space-y-2 p-2 ml-2 ${
            nestLevel > 0 && "mb-2"
          } ${nestLevel === 0 && "bg-stone-100"}`}
        >
          <DragBar
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          {nestLevel > 0 && (
            <LLDebouncedInput
              type="text"
              value={data[dataPropNames[nestLevel]]}
              onChange={handleCategoryModify}
              placeholder={capitalize(dataPropNames[nestLevel])}
              twStyle={((): string => {
                if (nestLevel === 1) return "text-2xl";
                if (nestLevel === 2) return "text-3xl text-white bg-gray-800";
                return "";
              })()}
            />
          )}
          {nestLevel === 0 &&
            (customButtonStatusInitFx === undefined
              ? renderFx(data, handleItemModify)
              : renderFx(data, handleItemModify, customButtonStatus))}
        </div>
        {nestLevel > 0 &&
          activeIndexes.length > 0 &&
          dragItemIndexes.length !== 1 && (
            <ul
              ref={uList}
              className="flex flex-col flex-nowrap justify-start items-stretch"
            >
              {data[arrayPropNames[nestLevel - 1]].map(
                (
                  childData: { uuid: string; [key: string]: any },
                  index: number
                ) => (
                  <DraggableListElement
                    key={childData.uuid}
                    data={childData}
                    nestLevel={nestLevel - 1}
                    dataPropNames={dataPropNames}
                    arrayPropNames={arrayPropNames}
                    dragItemIndexes={filterIndexes(dragItemIndexes, index)}
                    activeIndexes={filterIndexes(activeIndexes, index)}
                    renderFx={renderFx}
                    onModify={handleModify}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    onActivate={handleChildActivate}
                    onDragStart={handleChildDragStart}
                    onDragEnd={onDragEnd}
                    onDragEnter={handleChildDragEnter}
                  />
                )
              )}
            </ul>
          )}
      </div>
      <LLMenuButtons
        width={(() => {
          // Not sure why `w-${nestLevel * 2 + 6}` doesn't work
          switch (nestLevel) {
            case 0:
              return "w-6";
            case 1:
              return "w-8";
            case 2:
              return "w-10";
            default:
              return "w-6";
          }
        })()}
        height={`h-${nestLevel * 2 + 6}`}
        visibility={activeIndexes.length > 0 ? "visible" : "invisible"}
        twStyle={((): string => {
          switch (nestLevel) {
            case 0:
              return "bg-stone-100";
            case 1:
              return "bg-white";
            case 2:
              return "bg-gray-800 text-white";
            default:
              return "bg-stone-100";
          }
        })()}
        onAdd={() => {
          if (!component.current) return;
          onAdd(component.current);
        }}
        onRemove={() => {
          if (!component.current) return;
          onRemove(component.current);
        }}
        {...((): { customButtons?: JSX.Element } => {
          if (nestLevel > 0 || !customButton)
            return { customButtons: undefined };

          return {
            customButtons: (
              <button
                type="button"
                onClick={() => setCustomButtonStatus(!customButtonStatus)}
              >
                {customButton}
              </button>
            ),
          };
        })()}
      />
    </div>
  );
};

export default DraggableListElement;
