"use client";
import CcContext from "@/context/ccContext";
import React, { act, useContext, useEffect } from "react";
import DraggableWrapper from "@/components/DraggableWrapper";
import Image from "next/image";

export default function InvitationCard() {
  const {
    allItems,
    setAllItems,
    activeID,
    setActiveID,
    itemsRefs,
    shouldBeSelected,
    defText,
    defSticker,
    deleteField,
  } = useContext(CcContext);

  useEffect(() => {
    if (allItems && allItems.length > 0) {
      const updatedItem = allItems.map((item, index) => {
        let newItem = { ...item, zIndex: 10 + index };
        if (!newItem.position) {
          return { ...newItem, position: { x: 0, y: 0 } };
        }
        return newItem;
      });

      if (JSON.stringify(updatedItem) !== JSON.stringify(allItems)) {
        setAllItems(updatedItem);
      }

      updatedItem.forEach((item, index) => {
        if (item.itemType === "text") {
          const element = itemsRefs.current[item.id];
          if (element) {
            element.innerHTML = item.isPlaceholder
              ? "Enter text..."
              : item.text || "";
          }
        }
      });
    }
  }, []);

  const handleFocus = (e, index, id) => {
    let plch = allItems[index].isPlaceholder;

    const newItem = allItems.map((s, i) => ({
      ...s,
      active: i === index,
      contentEditable: i === index,
    }));

    setActiveID(id);

    if (plch) {
      e.currentTarget.innerHTML = "";
      newItem[index].isPlaceholder = false;
    }

    setAllItems(newItem);
  };

  // useEffect(() => {
  //   if (
  //     activeID !== null &&
  //     itemsRefs.current[activeID] &&
  //     allItems[activeID]?.contentEditable
  //   ) {
  //     itemsRefs.current[activeID].focus();

  //     const isPlaceholder = allItems[activeID].isPlaceholder;
  //     if (isPlaceholder) {
  //       itemsRefs.current[activeID].innerHTML = "";
  //     }
  //   }
  // }, [activeID, allItems]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".prevent-customize-card-blur") || activeID == null)
        return;

      setActiveID(null);

      setAllItems((prevItems) => {
        const newItems = prevItems.map((s) => {
          const updated = { ...s, active: false };
          if (s.itemType === "text") {
            updated.contentEditable = false;
          }
          return updated;
        });

        let activeItem = prevItems.find((item) => item.id === activeID);

        if (activeItem?.itemType === "text") {
          const htmlContent = itemsRefs.current[activeID].innerHTML;

          if (
            htmlContent.trim() === "" ||
            htmlContent === "Enter text..." ||
            htmlContent === "<br>"
          ) {
            return newItems.filter((item) => item.id !== activeID);
          } else {
            return newItems.map((item) => ({
              ...item,
              text: item.id === activeID ? htmlContent : item.text,
              isPlaceholder: item.id === activeID ? false : item.isPlaceholder,
            }));
          }
        }

        return newItems;
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeID]);

  return (
    <div
      className="overflow-hidden p-4 bg-gray-800 bg-no-repeat bg-cover relative"
      style={{
        width: "500px",
        height: "700px",
        backgroundImage: "url('/images/inv-card.jpg')",
      }}
    >
      {allItems &&
        allItems.length > 0 &&
        allItems.map((item, index) => {
          return (
            <DraggableWrapper
              className={`${item?.hidden ? "hidden" : ""} ${
                item?.locked ? "pointer-events-none user-select-none" : ""
              } ${
                item.active ? "active" : ""
              } prevent-customize-card-blur movable-handle-parent`}
              initialPosition={item.position}
              key={item.id}
              textObj={item.itemType === "text" && item}
              stickerObj={item.itemType === "sticker" && item}
              element={itemsRefs.current[item.id]}
              index={index}
              zIndex={item?.zIndex || 10}
              isActive={item.active}
              mode={item.itemType}
              style={{
                transform: `rotate(${item?.rotate || defText?.rotate}deg)`,
              }}
            >
              {({ isDragging, startDrag }) => (
                <>
                  {item.itemType === "text" && (
                    <div
                      onMouseDown={(e) => {
                        if (item.active) return;
                        startDrag({ e, type: "move" });
                      }}
                      ref={(el) => (itemsRefs.current[item.id] = el)}
                      contentEditable={item.contentEditable}
                      suppressContentEditableWarning
                      className={`${
                        item.active ? "active" : "!cursor-move"
                      } movable-handle p-2 focus:outline-none ${
                        item.isPlaceholder ? "!text-[#20f39b]" : "text-white"
                      } ${isDragging ? "movable-handle-hover" : ""}`}
                      onMouseUp={(e) => {
                        if (!shouldBeSelected) return;
                        handleFocus(e, index, item.id);
                      }}
                      style={{
                        fontSize: `${item?.fontSize || defText.fontSize}px`,
                        textAlign: `${item?.textAlign || defText.textAlign}`,
                        color: `${item?.color || defText.color}`,
                        fontWeight: `${item?.fontWeight || defText.fontWeight}`,
                        fontStyle: `${item?.fontStyle || defText.fontStyle}`,
                        lineHeight: `${
                          item?.lineHeight || item?.lineHeight.toString() == "0"
                            ? item.lineHeight
                            : defText.lineHeight
                        }`,
                        letterSpacing: `${
                          item?.letterSpacing || defText.letterSpacing
                        }px`,
                        textTransform: `${
                          item?.textTransform || defText.textTransform
                        }`,
                      }}
                    >
                      Enter text...
                    </div>
                  )}

                  {item.itemType === "sticker" && (
                    <div
                      onMouseDown={(e) => {
                        startDrag({ e, type: "move" });
                      }}
                      ref={(el) => (itemsRefs.current[item.id] = el)}
                      className={`${
                        item.active ? "active" : ""
                      } movable-handle !cursor-move p-2 focus:outline-none ${
                        isDragging ? "movable-handle-hover" : ""
                      }`}
                      style={{
                        width: `${item?.width || defSticker.width}px`,
                        transform: `scale(${
                          item?.scaleX || defSticker.scaleX
                        }, ${item?.scaleY || defSticker.scaleY})`,
                      }}
                      onMouseUp={(e) => {
                        if (!shouldBeSelected) return;

                        const newItem = allItems.map((s, i) => ({
                          ...s,
                          active: i === index,
                        }));

                        setAllItems(newItem);
                        setActiveID(item.id);
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
                  )}
                </>
              )}
            </DraggableWrapper>
          );
        })}
    </div>
  );
}
