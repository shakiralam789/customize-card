import { getFontFamily } from "@/helper/helper";
import Image from "next/image";
import React from "react";

export default function MainContentCom({
  zIndex,
  contextProps = {},
  handleContentChange,
  item,
  className,
  ...rest
}) {
  const { itemsRefs = {}, defText = {}, mainRefs = {} } = contextProps;
  return (
    <div
      {...rest}
      ref={(el) => {
        if (el) {
          mainRefs.current[item.id] = el;
        } else {
          delete mainRefs.current[item.id];
        }
      }}
      className={`group absolute ${className}`}
      style={{
        left: `${item?.position?.x}px`,
        top: `${item?.position?.y}px`,
        transform: `rotate(${
          item?.rotate != null ? item.rotate : 0
        }deg) scaleX(${item?.scaleX || 1}) scaleY(${item?.scaleY || 1})`,
        zIndex: item?.zIndex || 0,
        width:
          item?.itemType === "text" && item.contentEditable
            ? "auto"
            : item.width + "px" || "auto",
        height:
          item?.itemType === "text" && item.contentEditable
            ? "auto"
            : item.height + "px" || "auto",
        fontSize: `${item.fontSize || defText.fontSize}px`,
      }}
    >
      {item.itemType === "text" && (
        <div
          ref={(el) => {
            if (el) {
              itemsRefs.current[item.id] = el;
            } else {
              delete itemsRefs.current[item.id];
            }
          }}
          contentEditable={item.contentEditable}
          suppressContentEditableWarning
          className={`${item.isPlaceholder ? "!text-green-600" : "text-black"}
                              focus:outline-none whitespace-nowrap carent-color editable-div`}
          style={{
            textAlign: `${item?.textAlign || defText.textAlign}`,
            color: `${item?.color || defText.color}`,
            fontWeight: `${item?.fontWeight || defText.fontWeight}`,
            fontStyle: `${item?.fontStyle || defText.fontStyle}`,
            lineHeight: `${
              item?.lineHeight || item?.lineHeight.toString() == "0"
                ? item.lineHeight
                : defText.lineHeight
            }`,
            letterSpacing: `${item?.letterSpacing || defText.letterSpacing}px`,
            textTransform: `${item?.textTransform || defText.textTransform}`,
            fontFamily: getFontFamily(item?.fontFamily || defText.fontFamily),
          }}
          onInput={(e) => {
            handleContentChange({ e });
          }}
        >
          Enter text...
        </div>
      )}

      {item.itemType === "sticker" && (
        <Image
          ref={(el) => {
            if (el) {
              itemsRefs.current[item.id] = el;
            } else {
              delete itemsRefs.current[item.id];
            }
          }}
          className="w-full"
          width={400}
          height={400}
          src={item.src}
          alt={item?.alt || "image"}
        />
      )}
    </div>
  );
}
