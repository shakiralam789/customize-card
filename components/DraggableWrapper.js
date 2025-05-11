import React, { useEffect, useRef, useState } from "react";
import useDraggable from "@/hook/useDraggable";
import { Move, RotateCcw } from "lucide-react";
import {
  blRotation,
  brRotation,
  tlRotation,
  trRotation,
} from "@/helper/helper";
import HandleBtn from "./HandleBtn";
import PortalComponent from "./PortalComponent";

export default function DraggableWrapper({
  children,
  initialPosition,
  className = "",
  style = {},
  item,
  index,
  zIndex,
  mode,
  shouldBeSelected,
  isActive,
  parentRef,
  setShowCenterLine,
  setHorizontalCentralLine,
  setAllItems,
  allItems,
  zoomLevel,
  setIsAnyItemDragging,
  isAnyItemDragging,
  itemsRefs,
  activeID,
  onMouseUp,
  handlerRefs,
  ...props
}) {
  const [itemState, setItemState] = useState({
    rotate: item?.rotate || 0,
    width: item?.width || null,
    height: item?.height || null,
    fontSize: item?.fontSize || null,
    tlRotate: "tl",
    trRotate: "tr",
    blRotate: "bl",
    brRotate: "br",
    dragType: null,
  });

  const currentValues = useRef({
    angle: item?.rotate || 0,
    width: item?.width || null,
    height: item?.height || null,
    fontSize: item?.fontSize || null,
  });

  const initialFontSize = mode === "text" ? item.fontSize : null;
  const initialWidth = item.width || null;
  const initialHeight = item?.height || null;

  const { position, isDragging, startDrag } = useDraggable({
    zoomLevel,
    setHorizontalCentralLine,
    setShowCenterLine,
    initialPosition,
    parentRef: parentRef?.current,
    rotate: item?.rotate,
    item,
    onDragStart: (data) => {
      shouldBeSelected.current = true;
      setItemState((prev) => ({ ...prev, dragType: data?.type }));
    },

    onDragging: (data) => {
      setIsAnyItemDragging(true);
      if (data?.type !== "move") {
        requestAnimationFrame(() => {
          if (data?.type === "resize") {
            if (mode === "text") {
              currentValues.current.fontSize = initialFontSize * data?.scale;
            }
            currentValues.current.width = initialWidth * data?.scale;
            currentValues.current.height = initialHeight * data?.scale;
          }
          if (data?.type === "rotate") {
            currentValues.current.angle = data?.angle;
          }
          // Force a re-render by updating a minimal piece of state
          // setItemState(prev => ({...prev}));
        });
      }
    },

    onDragEnd: (data) => {
      shouldBeSelected.current = !data?.hasMoved;
      setIsAnyItemDragging(false);

      setItemState((prev) => ({
        ...prev,
        rotate: currentValues.current.angle,
        width: currentValues.current.width,
        height: currentValues.current.height,
        fontSize: currentValues.current.fontSize,
        dragType: null,
        ...(data?.type === "rotate" && {
          // tlRotate: tlRotation(data?.rotate),
          // trRotate: trRotation(data?.rotate),
          // blRotate: blRotation(data?.rotate),
          // brRotate: brRotation(data?.rotate),
        }),
      }));

      setAllItems((prevItems) => {
        return prevItems.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              position: data?.position,
              rotate: currentValues.current.angle,
              width: currentValues.current.width,
              height: currentValues.current.height,
              fontSize: currentValues.current.fontSize,
            };
          }
          return item;
        });
      });
    },
  });

  useEffect(() => {
    if (item?.rotate !== undefined) {
      currentValues.current.angle = item.rotate;
      setItemState((prev) => ({ ...prev, rotate: item.rotate }));
    }
  }, [item?.rotate]);

  useEffect(() => {
    if (item?.width !== undefined) {
      currentValues.current.width = item.width;
      setItemState((prev) => ({ ...prev, width: item.width }));
    }
  }, [item?.width]);

  useEffect(() => {
    if (item?.height !== undefined) {
      currentValues.current.height = item.height;
      setItemState((prev) => ({ ...prev, height: item.height }));
    }
  }, [item?.height]);

  useEffect(() => {
    if (item?.fontSize !== undefined) {
      currentValues.current.fontSize = item.fontSize;
      setItemState((prev) => ({ ...prev, fontSize: item.fontSize }));
    }
  }, [item?.fontSize]);

  useEffect(() => {
    let referItem = itemsRefs.current[activeID];
    if (referItem && item?.contentEditable && item.itemType === "text") {
      const range = document.createRange();
      range.selectNodeContents(referItem);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      item.isPlaceholder = false;
    }
  }, [item.contentEditable, activeID]);

  const { dragType, tlRotate, trRotate, blRotate, brRotate } = itemState;

  return (
    <>
      <div
        {...props}
        className={`group absolute ${className}`}
        style={{
          left: `${position?.x}px`,
          top: `${position?.y}px`,
          transform: `rotate(${currentValues.current.angle || 0}deg)`,
          zIndex: isDragging || isActive ? 99999 : zIndex,
          width:
            item?.itemType === "text" && item.contentEditable
              ? "auto"
              : currentValues.current.width + "px" || "auto",
          height:
            item?.itemType === "text" && item.contentEditable
              ? "auto"
              : currentValues.current.height + "px" || "auto",
        }}
      >
        {typeof children === "function"
          ? children({
              fontSize: currentValues.current.fontSize,
            })
          : children}
      </div>
      <PortalComponent>
        <div
          ref={(el) => {
            if (el) {
              handlerRefs.current[item.id] = el;
            } else {
              delete handlerRefs.current[item.id];
            }
          }}
          {...props}
          data-draggable
          className={`group absolute ${
            (item.itemType === "text" && isAnyItemDragging && !isDragging) ||
            item?.contentEditable
              ? "pointer-events-none"
              : ""
          }
          ${item?.contentEditable ? "content-editable" : ""}
           ${
             isDragging ? "movable-handle-hover" : ""
           } movable-handle ${className}`}
          style={{
            cursor: isDragging && !item.contentEditable ? "grabbing" : "move",
            left: `${position?.x}px`,
            top: `${position?.y}px`,
            transform: `rotate(${currentValues.current.angle || 0}deg)`,
            zIndex: isDragging || isActive ? 99999 : zIndex,
            width: currentValues.current.width + "px" || "auto",
            height: currentValues.current.height + "px" || "auto",
          }}
          onMouseDown={(e) => {
            if (
              item?.itemType == "text" &&
              item.active &&
              item?.contentEditable
            )
              return;

            startDrag({ e, type: "move" });
          }}
          onMouseUp={(e) => {
            setTimeout(() => {
              if (!shouldBeSelected.current) return;
              onMouseUp({ e, item });
            }, 0);
          }}
        >
          {isActive && !item?.locked && (
            <>
              <div className="pointer-events-auto absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 flex gap-1.5 items-center justify-center">
                {dragType == "resize" && isDragging ? null : (
                  <>
                    <HandleBtn
                      onMouseDown={(e) => startDrag({ e, type: "rotate" })}
                      className={
                        isDragging && dragType == "rotate" ? "active" : ""
                      }
                    >
                      <RotateCcw />
                    </HandleBtn>
                    <HandleBtn
                      onMouseDown={(e) => startDrag({ e, type: "move" })}
                      className={
                        isDragging && dragType == "move" ? "active" : ""
                      }
                    >
                      <Move className="w-full" />
                    </HandleBtn>
                  </>
                )}
              </div>

              {/* Corner resize handlers */}
              <span
                onMouseDown={(e) =>
                  startDrag({ e, type: "resize", dir: tlRotate })
                }
                className={`pointer-events-auto cursor-nwse-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2`}
              ></span>

              <span
                onMouseDown={(e) =>
                  startDrag({ e, type: "resize", dir: trRotate })
                }
                className={`pointer-events-auto cursor-nesw-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2`}
              ></span>
              <span
                onMouseDown={(e) =>
                  startDrag({ e, type: "resize", dir: blRotate })
                }
                className={`pointer-events-auto cursor-nesw-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}
              ></span>

              <span
                onMouseDown={(e) =>
                  startDrag({ e, type: "resize", dir: brRotate })
                }
                className={`pointer-events-auto cursor-nwse-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2`}
              ></span>
            </>
          )}
        </div>
      </PortalComponent>
    </>
  );
}
