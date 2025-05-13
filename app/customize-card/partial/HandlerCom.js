import HandleBtn from "@/components/HandleBtn";
import ResizeCircle from "@/components/ResizeCircle";
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
  dir,
  angle,
  ...rest
}) => {
  const {
    handlerRefs = {},
    isAnyItemDragging,
    shouldBeSelected,
  } = contextProps;

  useEffect(() => {
    if (isDragging) {
      if (dragType === "move") {
        document.body.classList.add("moving");
      } else if (dragType === "rotate") {
        document.body.classList.add("grabbing");
      } else if (dragType === "resize") {
        document.body.classList.add("resizing");
      }
    }

    return () => {
      document.body.classList.remove("moving");
      document.body.classList.remove("grabbing");
      document.body.classList.remove("resizing");
    };
  }, [isDragging]);

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
                  className={`cursor-alias ${
                    isDragging && dragType == "rotate" ? "active" : ""
                  }`}
                >
                  <RotateCcw />
                  {isDragging && dragType == "rotate" && (
                    <div
                      style={{
                        transform: `rotate(-${angle}deg)`,
                      }}
                      className="text-white text-xs font-medium rounded-md bg-opacity-80 bg-black px-2 py-1 absolute top-[-50px] left-[50px] -translate-x-1/2"
                    >
                      {angle}&deg;
                    </div>
                  )}
                </HandleBtn>
                <HandleBtn
                  onMouseDown={(e) => startDrag({ e, type: "move" })}
                  className={` ${
                    isDragging && dragType == "move" ? "active" : ""
                  }`}
                >
                  <Move className="w-full" />
                </HandleBtn>
              </>
            )}
          </div>

          {/* Corner resize handlers */}

          {item.width && item.width && item.height > 60 && (
            <>
              <ResizeCircle
                onMouseDown={(e) =>
                  startDrag({ e, type: "resize", dir: tlRotate })
                }
                className={`${
                  isDragging && dragType == "resize" && dir && dir == tlRotate
                    ? "active"
                    : ""
                } pointer-events-auto cursor-nwse-resize size-handler absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2`}
              ></ResizeCircle>

              <ResizeCircle
                onMouseDown={(e) =>
                  startDrag({ e, type: "resize", dir: trRotate })
                }
                className={`${
                  isDragging && dragType == "resize" && dir && dir == trRotate
                    ? "active"
                    : ""
                } pointer-events-auto cursor-nesw-resize size-handler absolute top-0 right-0 translate-x-1/2 -translate-y-1/2`}
              ></ResizeCircle>
            </>
          )}
          {item?.width > 60 && (
            <ResizeCircle
              onMouseDown={(e) =>
                startDrag({ e, type: "resize", dir: blRotate })
              }
              className={`${
                isDragging && dragType == "resize" && dir && dir == blRotate
                  ? "active"
                  : ""
              } pointer-events-auto cursor-nesw-resize size-handler absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}
            ></ResizeCircle>
          )}

          <ResizeCircle
            onMouseDown={(e) => startDrag({ e, type: "resize", dir: brRotate })}
            className={`${
              isDragging && dragType == "resize" && dir && dir == brRotate
                ? "active"
                : ""
            } pointer-events-auto cursor-nwse-resize size-handler absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2`}
          ></ResizeCircle>
        </>
      )}
    </div>
  );
};

export default withDraggable(HandlerCom);
