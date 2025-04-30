import React, { useContext, useEffect } from "react";
import useDraggable from "@/hook/useDraggable";
import { Move } from "lucide-react";
import { getWidthAndAspectRatio } from "@/helper/helper";
import CcContext from "@/context/ccContext";

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
  const { allText, setAllText, stickers, setStickers } = useContext(CcContext);

  const initialFontSize = textObj.fontSize;
  const initialWidth = stickerObj.width;
  
  const { position, isDragging, startDrag } = useDraggable({
    initialValue: { position: initialPosition, element },
    onDragging: (data) => {
      if (mode == "text") {
        let newText = [...allText];
        newText[index].fontSize = initialFontSize * data?.scale;
        setAllText(newText);
      }
      
      if (mode == "sticker") {
        let sticker = [...stickers];
        sticker[index].width = initialWidth * data?.scale;
        setStickers(sticker);
      }
    },
  });

  return (
    <div
      {...props}
      className={`group absolute ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        ...style,
      }}
    >
      <div
        onMouseDown={(e) => startDrag({ e, type: "move" })}
        className={`move-icon absolute -right-2 -top-0 transform -translate-y-1/2 
                          bg-gray-800 p-1 rounded hover:bg-gray-700 z-10
                          ${
                            isDragging || isActive
                              ? "block"
                              : "hidden group-hover:block"
                          }`}
      >
        <Move size={16} className="text-white" />
      </div>
      {typeof children === "function"
        ? children({ startDrag, isDragging, position })
        : children}

      <span
        onMouseDown={(e) => startDrag({ e, type: "resize", dir: "tl" })}
        className={`${
          isActive ? "block cursor-nwse-resize" : "hidden pointer-events-none"
        } size-handler size-3.5 bg-white rounded-full absolute top-0.5 left-0.5 -translate-x-1/2 -translate-y-1/2`}
      ></span>
      <span
        onMouseDown={(e) => startDrag({ e, type: "resize", dir: "bl" })}
        className={`${
          isActive ? "block cursor-nesw-resize" : "hidden pointer-events-none"
        } size-handler size-3.5 bg-white rounded-full absolute bottom-0.5 left-0.5 -translate-x-1/2 translate-y-1/2`}
      ></span>

      <span
        onMouseDown={(e) => startDrag({ e, type: "resize", dir: "br" })}
        className={`${
          isActive ? "block cursor-nwse-resize" : "hidden pointer-events-none"
        } size-handler size-3.5 bg-white rounded-full absolute bottom-0.5 right-0.5 translate-x-1/2 translate-y-1/2`}
      ></span>
    </div>
  );
}
