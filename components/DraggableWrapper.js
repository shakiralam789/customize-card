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
  ...props
}) {
  const [rotate, setRotate] = useState(item?.rotate || 0);
  const [width, setWidth] = useState(item?.width || null);
  const [fontSize, setFontSize] = useState(item?.fontSize || null);

  const currentAngle = useRef(item?.rotate);
  const currentWidth = useRef(item?.width || null);
  const currentFontSize = useRef(item?.fontSize || null);

  const animationFrame = useRef(null);

  const initialFontSize = mode === "text" ? item.fontSize : null;
  const initialWidth = mode === "sticker" ? item.width : null;

  const [dragType, setDragType] = useState(null);

  const [tlRotate, setTlRotate] = useState("tl");
  const [trRotate, setTrRotate] = useState("tr");
  const [blRotate, setBlRotate] = useState("bl");
  const [brRotate, setBrRotate] = useState("br");

  const { scale, position, isDragging, startDrag } = useDraggable({
    zoomLevel,
    setHorizontalCentralLine,
    setShowCenterLine,
    initialPosition,
    parentRef: parentRef?.current,
    rotate: item?.rotate,
    onDragStart: (data) => {
      shouldBeSelected.current = true;
      setDragType(data?.type);
    },

    onDragging: (data) => {
      setIsAnyItemDragging(true);
      if (data?.type !== "move") {
        if (data?.type === "resize") {
          if (mode === "text") {
            currentFontSize.current = initialFontSize * data?.scale;
            setFontSize(currentFontSize.current);
          } else {
            currentWidth.current = initialWidth * data?.scale;
            setWidth(currentWidth.current);
          }
        }

        if (data?.type === "rotate") {
          currentAngle.current = data?.angle;
          setRotate(data?.angle);
        }
      }
    },
    onDragEnd: (data) => {
      shouldBeSelected.current = !data?.hasMoved;
      setIsAnyItemDragging(false);
      setRotate(currentAngle.current);
      setAllItems((prevItems) => {
        return prevItems.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item };
            updatedItem.position = data?.position;
            updatedItem.rotate = currentAngle.current;
            updatedItem.width = currentWidth.current;
            updatedItem.fontSize = Math.round(currentFontSize.current);
            return updatedItem;
          }
          return item;
        });
      });

      if (data?.type == "rotate") {
        setTlRotate(tlRotation(data?.rotate));
        setTrRotate(trRotation(data?.rotate));
        setBlRotate(blRotation(data?.rotate));
        setBrRotate(brRotation(data?.rotate));
      }

      setDragType(null);
    },
  });

  useEffect(() => {
    currentAngle.current = item?.rotate;
    setRotate(item?.rotate);
  }, [item?.rotate]);

  useEffect(() => {
    currentWidth.current = item?.width;
    setWidth(item?.width);
  }, [item?.width]);

  useEffect(() => {
    currentFontSize.current = Math.round(item?.fontSize);
    setFontSize(Math.round(item?.fontSize));
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
  }, [item.contentEditable]);

  return (
    <div
      {...props}
      data-draggable
      className={`group absolute ${
        isAnyItemDragging && !isDragging ? "pointer-events-none" : ""
      } ${
        isDragging ? "movable-handle-hover" : ""
      } movable-handle ${className}`}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        transform: `translate(${position?.x}px, ${position?.y}px) rotate(${
          rotate || 0
        }deg)`,
        ...style,
        zIndex: isDragging || isActive ? 99999 : zIndex,
        width: width,
        fontSize: fontSize,
      }}
    >
      {typeof children === "function"
        ? children({
            startDrag,
            isDragging,
            position,
          })
        : children}

      {isActive && !item?.locked && (
        <>
          <div className="absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 flex gap-1.5 items-center justify-center">
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

          <span
            onMouseDown={(e) => startDrag({ e, type: "resize", dir: tlRotate })}
            className={`cursor-nwse-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2`}
          ></span>

          <span
            onMouseDown={(e) => startDrag({ e, type: "resize", dir: trRotate })}
            className={`cursor-nesw-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2`}
          ></span>
          <span
            onMouseDown={(e) => startDrag({ e, type: "resize", dir: blRotate })}
            className={`cursor-nesw-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}
          ></span>

          <span
            onMouseDown={(e) => startDrag({ e, type: "resize", dir: brRotate })}
            className={`cursor-nwse-resize size-handler border border-gray-400 size-3.5 bg-white rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2`}
          ></span>
        </>
      )}
    </div>
  );
}

// export default React.memo(DraggableWrapper, (prev, next) => {
//   return (
//     JSON.stringify(prev.item) == JSON.stringify(next.item) &&
//     prev.isActive === next.isActive &&
//     prev.zoomLevel === next.zoomLevel &&
//     prev.mode === next.mode
//   );
// });
