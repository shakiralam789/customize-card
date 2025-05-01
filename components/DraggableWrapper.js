import React, { useContext, useState } from "react";
import useDraggable from "@/hook/useDraggable";
import { Move } from "lucide-react";
import CcContext from "@/context/ccContext";
import {
  blRotation,
  brRotation,
  tlRotation,
  trRotation,
} from "@/helper/helper";

export default function DraggableWrapper({
  children,
  initialPosition,
  className = "",
  style = {},
  textObj = {},
  stickerObj = {},
  index,
  element,
  mode,
  isActive,
  ...props
}) {
  const { allText, setAllText, stickers, setStickers, setShouldBeSelected } =
    useContext(CcContext);

  const initialFontSize = textObj.fontSize;
  const initialWidth = stickerObj.width;
  const [dragType, setDragType] = useState(null);

  const [tlRotate, setTlRotate] = useState("tl");
  const [trRotate, setTrRotate] = useState("tr");
  const [blRotate, setBlRotate] = useState("bl");
  const [brRotate, setBrRotate] = useState("br");

  const { position, isDragging, startDrag } = useDraggable({
    initialValue: { position: initialPosition, element },
    onDragStart: (data) => {
      if (data?.type == "rotate") {
        setDragType(data?.type);
      }
    },
    onDragging: (data) => {
      setShouldBeSelected(false);
      if (mode == "text") {
        let newText = [...allText];
        if (data?.type == "resize") {
          newText[index].fontSize = initialFontSize * data?.scale;
        }

        if (data?.type == "rotate") {
          newText[index].rotate = data?.angle;
        }

        setAllText(newText);
      }

      if (mode == "sticker") {
        let sticker = [...stickers];
        if (data?.type == "resize") {
          sticker[index].width = initialWidth * data?.scale;
        }
        if (data?.type == "rotate") {
          sticker[index].rotate = data?.angle;
        }
        if (data?.type == "rotate" || data?.type == "resize") {
          setStickers(sticker);
        }
      }
    },
    onDragEnd: (data) => {
      setShouldBeSelected(true);
      if (data?.type == "rotate") {
        if (mode == "sticker") {
          setTlRotate(tlRotation(stickerObj?.rotate));
          if (mode == "sticker") {
            setTrRotate(trRotation(stickerObj?.rotate));
          }
          setBlRotate(blRotation(stickerObj?.rotate));
          setBrRotate(brRotation(stickerObj?.rotate));
        }

        if (mode == "text") {
          setTlRotate(tlRotation(textObj?.rotate));
          // setTrRotate(trRotation(textObj?.rotate));
          setBlRotate(blRotation(textObj?.rotate));
          setBrRotate(brRotation(textObj?.rotate));
        }
      }

      setDragType(null);
    },
  });

  return (
    <div
      {...props}
      className={`group absolute ${isDragging ? "z-50" : "z-10"} ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging || isActive ? "999" : "10",
        ...style,
      }}
    >
      {mode == "text" && (
        <div
          onMouseDown={(e) => startDrag({ e, type: "move" })}
          className={`move-icon absolute -right-2 -top-0 transform -translate-y-1/2 
                          bg-gray-800 p-1 rounded hover:bg-gray-700 z-10
                          ${isActive ? "block" : "hidden"}`}
        >
          <Move size={16} className="text-white" />
        </div>
      )}

      {typeof children === "function"
        ? children({ startDrag, isDragging, position })
        : children}

      {isActive && (
        <div
          onMouseDown={(e) => startDrag({ e, type: "rotate" })}
          className={`${
            isDragging && dragType == "rotate" ? "active" : ""
          } absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 text-black bg-white hover:bg-emerald-500 hover:text-white [&.active]:bg-emerald-500 [&.active]:text-white rounded-full size-9 flex items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m21 17.325-2.963.685-.681-2.947M3 6.673l2.963-.685.681 2.947m3.928-5.185a8.373 8.373 0 0 1 7.515 13.999m-4.66 2.502a8.373 8.373 0 0 1-7.47-14.048"
            ></path>
          </svg>
        </div>
      )}

      <span
        onMouseDown={(e) => startDrag({ e, type: "resize", dir: tlRotate })}
        className={`${
          isActive ? "block cursor-nwse-resize" : "hidden pointer-events-none"
        } size-handler size-3.5 bg-white rounded-full absolute top-0.5 left-0.5 -translate-x-1/2 -translate-y-1/2`}
      ></span>

      {mode == "sticker" && (
        <span
          onMouseDown={(e) => startDrag({ e, type: "resize", dir: trRotate })}
          className={`${
            isActive ? "block cursor-nesw-resize" : "hidden pointer-events-none"
          } size-handler size-3.5 bg-white rounded-full absolute top-0.5 right-0.5 translate-x-1/2 -translate-y-1/2`}
        ></span>
      )}

      <span
        onMouseDown={(e) => startDrag({ e, type: "resize", dir: blRotate })}
        className={`${
          isActive ? "block cursor-nesw-resize" : "hidden pointer-events-none"
        } size-handler size-3.5 bg-white rounded-full absolute bottom-0.5 left-0.5 -translate-x-1/2 translate-y-1/2`}
      ></span>

      <span
        onMouseDown={(e) => startDrag({ e, type: "resize", dir: brRotate })}
        className={`${
          isActive ? "block cursor-nwse-resize" : "hidden pointer-events-none"
        } size-handler size-3.5 bg-white rounded-full absolute bottom-0.5 right-0.5 translate-x-1/2 translate-y-1/2`}
      ></span>
    </div>
  );
}
