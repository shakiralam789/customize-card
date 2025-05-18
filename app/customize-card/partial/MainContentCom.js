import { getFontFamily, managePosition } from "@/helper/helper";
import Image from "next/image";
import React, { useEffect } from "react";

export default function MainContentCom({
  zIndex,
  contextProps = {},
  handleContentChange,
  item,
  className,
  ...rest
}) {
  const {
    activeID,
    itemsRefs = {},
    defText = {},
    mainRefs = {},
    scrollRef,
    parentRef,
    handlerRefs,
    updatePositionState,
    updateInnerHTML,
  } = contextProps;

  useEffect(() => {
    if (activeID && item.contentEditable) {
      let referItem = itemsRefs.current[activeID];
      if (referItem && item?.contentEditable && item.itemType === "text") {
        const range = document.createRange();
        range.selectNodeContents(referItem);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        item.isPlaceholder = false;
      }

      if (item?.textCurve && item?.textCurve !== 0) {
        let currentHandler = handlerRefs.current[activeID];
        let parent = parentRef.current;

        let position = managePosition({
          idol: referItem,
          follower: currentHandler,
          parent,
          scrollParent: scrollRef.current,
          item: item || {},
        });

        updatePositionState(
          {
            width: position.width,
            height: position.height,
            left: position.left,
          },
          activeID
        );
      }
    } else {
      const element = itemsRefs.current[item.id];
      updateInnerHTML({ element, item });
    }
  }, [item.contentEditable, item.active]);

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
      className={`editable-div-parent group absolute ${className}`}
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
            : item.width + "px",
        height:
          item?.itemType === "text" && item.contentEditable
            ? "auto"
            : item.height + "px",
        fontSize: `${item.fontSize || defText.fontSize}px`,
        opacity: item?.opacity ?? 1,
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
          className={`px-1 focus:outline-none whitespace-nowrap carent-color editable-div`}
          style={{
            textAlign: `${item?.textAlign || defText.textAlign}`,
            color: `${item?.color || defText.color}`,
            fontWeight: `${item?.fontWeight || defText.fontWeight}`,
            fontStyle: `${item?.fontStyle || defText.fontStyle}`,
            lineHeight: `${
              item?.lineHeight || item?.lineHeight.toString() == "0"
                ? item.lineHeight
                : defText.lineHeight
            }%`,
            letterSpacing: `${item?.letterSpacing || defText.letterSpacing}em`,
            textTransform: `${item?.textTransform || defText.textTransform}`,
            fontFamily: getFontFamily(item?.fontFamily || defText.fontFamily),
            caretColor: item?.color || defText.color,
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
          src={item.src}
          alt={item?.alt || "image"}
          width={500}
          height={300}
          priority
        />
      )}
    </div>
  );
}
