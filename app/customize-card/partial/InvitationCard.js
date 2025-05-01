"use client";
import CcContext from "@/context/ccContext";
import React, { act, useContext, useEffect } from "react";
import DraggableWrapper from "@/components/DraggableWrapper";
import Image from "next/image";

export default function InvitationCard() {
  const {
    allText,
    setAllText,
    ignoreBlurRef,
    activeEditIndex,
    setActiveEditIndex,
    setActiveStickerIndex,
    editableRefs,
    stickerRefs,
    setStickers,
    stickers,
    activeStickerIndex,
    shouldBeSelected,
    defText,
    defSticker,
  } = useContext(CcContext);

  useEffect(() => {
    if (allText && allText.length > 0) {
      const updatedText = allText.map((item) => {
        if (!item.position) {
          return { ...item, position: { x: 0, y: 0 } };
        }
        return item;
      });

      if (JSON.stringify(updatedText) !== JSON.stringify(allText)) {
        setAllText(updatedText);
      }

      updatedText.forEach((textItem, index) => {
        const element = editableRefs.current[index];
        if (element) {
          element.innerHTML = textItem.isPlaceholder
            ? "Enter text..."
            : textItem.text || "";
        }
      });
    }
  }, []);

  const handleFocus = (e, index) => {
    let plch = allText[index].isPlaceholder;
    // let newText = [...allText];

    const newText = allText.map((s, i) => ({
      ...s,
      active: i === index,
      contentEditable: i === index,
    }));

    setActiveEditIndex(index);

    if (plch) {
      e.currentTarget.innerHTML = "";
      newText[index].isPlaceholder = false;
    }

    setAllText(newText);
  };

  // useEffect(() => {
  //   if (
  //     activeEditIndex !== null &&
  //     editableRefs.current[activeEditIndex] &&
  //     allText[activeEditIndex]?.contentEditable
  //   ) {
  //     editableRefs.current[activeEditIndex].focus();

  //     const isPlaceholder = allText[activeEditIndex].isPlaceholder;
  //     if (isPlaceholder) {
  //       editableRefs.current[activeEditIndex].innerHTML = "";
  //     }
  //   }
  // }, [activeEditIndex, allText]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        e.target.closest(".customize-card-navbar") ||
        e.target.closest(".sticker-parent") ||
        activeStickerIndex == null
      )
        return;
      const newStickers = stickers?.map((s) => ({ ...s, active: false }));
      setActiveStickerIndex(null);
      if (JSON.stringify(newStickers) !== JSON.stringify(stickers)) {
        setStickers(newStickers);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [stickers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        e.target.closest(".customize-card-navbar") ||
        e.target.closest(".text-parent") ||
        activeEditIndex == null
      )
        return;

      const newText = allText?.map((s) => ({
        ...s,
        active: false,
        contentEditable: false,
      }));
      setActiveEditIndex(null);
      if (JSON.stringify(newText) !== JSON.stringify(stickers)) {
        setAllText(newText);
      }

      const htmlContent = editableRefs.current[activeEditIndex].innerHTML;

      if (htmlContent.trim() === "") {
        newText[activeEditIndex].isPlaceholder = true;
        newText[activeEditIndex].text = "";
        editableRefs.current[activeEditIndex].innerHTML = "Enter text...";
      } else {
        newText[activeEditIndex].isPlaceholder = false;
        newText[activeEditIndex].text = htmlContent;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [allText]);

  return (
    <div
      className="overflow-hidden p-4 bg-gray-800 bg-no-repeat bg-cover relative"
      style={{
        width: "500px",
        height: "700px",
        backgroundImage: "url('/images/inv-card.jpg')",
      }}
    >
      {allText &&
        allText.length > 0 &&
        allText.map((text, index) => {
          return (
            <DraggableWrapper
              className={`${
                text.active ? "active" : ""
              } text-parent movable-handle-parent`}
              initialPosition={text.position}
              key={index}
              textObj={text}
              element={editableRefs.current[index]}
              index={index}
              isActive={text.active}
              mode="text"
            >
              {({ isDragging, startDrag }) => (
                <>
                  <div
                    onMouseDown={(e) => {
                      if (text.active) return;
                      startDrag({ e, type: "move" });
                    }}
                    ref={(el) => (editableRefs.current[index] = el)}
                    contentEditable={text.contentEditable}
                    suppressContentEditableWarning
                    className={`${
                      text.active ? "active" : "!cursor-move"
                    } movable-handle p-2 focus:outline-none ${
                      text.isPlaceholder ? "!text-[#20f39b]" : "text-white"
                    } ${isDragging ? "movable-handle-hover" : ""}`}
                    onMouseUp={(e) => {
                      if (!shouldBeSelected) return;
                      handleFocus(e, index);
                    }}
                    style={{
                      fontSize: `${text?.fontSize || defText.fontSize}px`,
                      textAlign: `${text?.textAlign || defText.textAlign}`,
                      color: `${text?.color || defText.color}`,
                      fontWeight: `${text?.fontWeight || defText.fontWeight}`,
                      fontStyle: `${text?.fontStyle || defText.fontStyle}`,
                      lineHeight: `${
                        text?.lineHeight || text?.lineHeight.toString() == "0"
                          ? text.lineHeight
                          : defText.lineHeight
                      }`,
                      letterSpacing: `${
                        text?.letterSpacing || defText.letterSpacing
                      }px`,
                      textTransform: `${
                        text?.textTransform || defText.textTransform
                      }`,
                    }}
                  >
                    Enter Text...
                  </div>
                </>
              )}
            </DraggableWrapper>
          );
        })}

      {stickers &&
        stickers.length > 0 &&
        stickers.map((item, index) => {
          return (
            <DraggableWrapper
              className={`${
                item.active ? "active" : ""
              } sticker-parent movable-handle-parent`}
              initialPosition={item.position}
              key={index}
              index={index}
              isActive={item.active}
              stickerObj={item}
              mode="sticker"
              element={stickerRefs.current[index]}
              style={{
                transform: `rotate(${item?.rotate || defSticker.rotate}deg)`,
              }}
            >
              {({ isDragging, startDrag }) => (
                <>
                  <div
                    onMouseDown={(e) => {
                      startDrag({ e, type: "move" });
                    }}
                    ref={(el) => (stickerRefs.current[index] = el)}
                    className={`${
                      item.active ? "active" : ""
                    } movable-handle !cursor-move p-2 focus:outline-none ${
                      isDragging ? "movable-handle-hover" : ""
                    }`}
                    style={{
                      width: `${item?.width || defSticker.width}px`,
                      transform: `scale(${item?.scaleX || defSticker.scaleX}, ${
                        item?.scaleY || defSticker.scaleY
                      })`,
                    }}
                    onMouseUp={(e) => {
                      if (!shouldBeSelected) return;

                      const newSticker = stickers.map((s, i) => ({
                        ...s,
                        active: i === index,
                      }));

                      setStickers(newSticker);
                      setActiveStickerIndex(index);
                    }}
                  >
                    <Image
                      className="w-full"
                      width={400}
                      height={400}
                      src={item.src}
                      alt={item?.alt || "image"}
                    />
                  </div>
                </>
              )}
            </DraggableWrapper>
          );
        })}
    </div>
  );
}
