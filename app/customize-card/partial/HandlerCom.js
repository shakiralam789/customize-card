import HandleBtn from "@/components/HandleBtn";
import withDraggable from "@/HOC/withDraggable";
import { Move, RotateCcw } from "lucide-react";
import React, { useEffect } from "react";

const HandlerCom = ({
  contextProps = {},
  item,
  isDragging,
  dragType,
  startDrag,
  tlRotate,
  trRotate,
  blRotate,
  brRotate,
  currentValues,
  onMouseUp,
  className,
  ...rest
}) => {
  const {
    handlerRefs = {},
    isAnyItemDragging,
    shouldBeSelected,
  } = contextProps;

  return (
    <div
      {...rest}
      ref={(el) => {
        if (el) {
          handlerRefs.current[item.id] = el;
        } else {
          delete handlerRefs.current[item.id];
        }
      }}
      data-draggable
      className={`group absolute ${
        (item.itemType === "text" && isAnyItemDragging && !isDragging) ||
        item?.contentEditable
          ? "pointer-events-none"
          : ""
      }
          ${item?.contentEditable ? "content-editable" : ""}
           ${isDragging ? "movable-handle-hover" : ""} movable-handle ${
        item?.itemType || ""
      } ${className}`}
      style={{
        cursor: isDragging && !item.contentEditable ? "grabbing" : "move",
        left: `${item?.position?.x}px`,
        top: `${item?.position?.y}px`,
        transform: `rotate(${item.rotate || 0}deg)`,
        zIndex: isDragging || item.active ? 99999 : item?.zIndex,
        width: item.width + "px" || "auto",
        height: item.height + "px" || "auto",
      }}
    >
      <div
        onMouseDown={(e) => {
          if (item?.itemType == "text" && item.active && item?.contentEditable)
            return;

          startDrag({ e, type: "move" });
        }}
        onMouseUp={(e) => {
          setTimeout(() => {
            if (!shouldBeSelected.current) return;
            onMouseUp({ e, item });
          }, 0);
        }}
        className="absolute top-0 left-0 w-full h-full"
      ></div>
      {item.active && !item?.locked && (
        <>
          <div className="pointer-events-auto absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 flex gap-1.5 items-center justify-center">
            {dragType == "resize" && isDragging ? null : (
              <>
                <HandleBtn
                  onMouseDown={(e) => startDrag({ e, type: "rotate" })}
                  className={isDragging && dragType == "rotate" ? "active" : ""}
                >
                  <RotateCcw />
                </HandleBtn>
                <HandleBtn
                  onMouseDown={(e) => startDrag({ e, type: "move" })}
                  className={isDragging && dragType == "move" ? "active" : ""}
                >
                  <Move className="w-full" />
                </HandleBtn>
              </>
            )}
          </div>

          {/* Corner resize handlers */}

          {item.width && item.width && item.height > 60 && (
            <>
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
            </>
          )}
          {item?.width > 60 && (
            <span
              onMouseDown={(e) =>
                startDrag({ e, type: "resize", dir: blRotate })
              }
              className={`pointer-events-auto cursor-nesw-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}
            ></span>
          )}

          <span
            onMouseDown={(e) => startDrag({ e, type: "resize", dir: brRotate })}
            className={`pointer-events-auto cursor-nwse-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2`}
          ></span>
        </>
      )}
    </div>
  );
};

export default withDraggable(HandlerCom);
