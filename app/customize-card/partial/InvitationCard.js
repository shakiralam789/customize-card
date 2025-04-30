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
    let newText = [...allText];

    newText[index].active = true;
    setActiveEditIndex(index);
    if (plch) {
      e.currentTarget.innerHTML = "";
      newText[index].isPlaceholder = false;
    }

    setAllText(newText);
  };

  const handleBlur = (e) => {
    if (ignoreBlurRef.current) {
      setTimeout(() => {
        if (editableRefs.current[activeEditIndex]) {
          editableRefs.current[activeEditIndex].focus();
        }
      }, 0);
      return;
    }

    let newText = [...allText];
    newText[activeEditIndex].active = false;

    const htmlContent = editableRefs.current[activeEditIndex].innerHTML;

    if (htmlContent.trim() === "") {
      newText[activeEditIndex].isPlaceholder = true;
      newText[activeEditIndex].text = "";
      editableRefs.current[activeEditIndex].innerHTML = "Enter text...";
    } else {
      newText[activeEditIndex].isPlaceholder = false;
      newText[activeEditIndex].text = htmlContent;
    }

    setActiveEditIndex(null);
    setAllText(newText);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".sticker-parent")) return;
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
              className={`${text.active ? "active" : ""} movable-handle-parent`}
              initialPosition={text.position}
              key={index}
              textObj={text}
              element={editableRefs.current[index]}
              index={index}
              isActive={text.active}
              mode="text"
            >
              {({ isDragging }) => (
                <>
                  <div
                    ref={(el) => (editableRefs.current[index] = el)}
                    contentEditable={text.contentEditable}
                    suppressContentEditableWarning
                    className={`${
                      text.active ? "active" : ""
                    } movable-handle p-2 focus:outline-none ${
                      text.isPlaceholder ? "!text-[#20f39b]" : "text-white"
                    } ${isDragging ? "movable-handle-hover" : ""}`}
                    onFocus={(e) => handleFocus(e, index)}
                    onBlur={(e) => handleBlur(e)}
                    style={{
                      fontSize: `${text?.fontSize}px`,
                      textAlign: `${text?.textAlign}`,
                      color: `${text?.color}`,
                      fontWeight: `${text?.fontWeight}`,
                      fontStyle: `${text?.fontStyle}`,
                      lineHeight: `${text?.lineHeight}`,
                      letterSpacing: `${text?.letterSpacing}px`,
                      textTransform: `${text?.textTransform}`,
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
              className={`${item.active ? "active" : ""} sticker-parent movable-handle-parent`}
              initialPosition={item.position}
              key={index}
              index={index}
              isActive={item.active}
              stickerObj={item}
              mode="sticker"
              element={stickerRefs.current[index]}
            >
              {({ isDragging }) => (
                <>
                  <div
                    ref={(el) => (stickerRefs.current[index] = el)}
                    className={`${
                      item.active ? "active" : ""
                    } movable-handle p-2 focus:outline-none ${
                      isDragging ? "movable-handle-hover" : ""
                    }`}
                    style={{
                      width: `${item?.width}px`,
                    }}
                    onMouseDown={(e) => {
                      // e.stopPropagation();

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
