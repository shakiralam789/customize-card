"use client";
import React, { useEffect } from "react";
import DraggableWrapper from "@/components/DraggableWrapper";
import Image from "next/image";
import { getFontFamily } from "@/helper/helper";

export default function InvitationCard({
  zoomLevel,
  allItems,
  activeID,
  setActiveID,
  itemsRefs,
  shouldBeSelected,
  defText,
  defSticker,
  showCenterLine,
  parentRef,
  setShowCenterLine,
  setAllItems,
  horizontalCentralLine,
  setHorizontalCentralLine,
  frame,
  setIsAnyItemDragging,
  isAnyItemDragging,
  setFrame,
}) {
  const handleFocus = (e, index, id) => {
    let plch = allItems[index].isPlaceholder;
    const newItem = allItems.map((s, i) => ({
      ...s,
      active: i === index,
      contentEditable: i === index,
    }));

    setActiveID(id);
    
    if (plch) {
      let target = e.target.closest(".movable-handle");
      
      if (target) {
        target.innerHTML = "";
      }
      
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
      ref={parentRef}
      className="p-4 bg-no-repeat bg-cover relative shadow"
      style={{
        width: "400px",
        height: "550px",
        backgroundColor: `${
          frame?.backgroundColor ? frame.backgroundColor : "#fff"
        }`,
        backgroundImage: `${
          frame?.backgroundImage ? `url(${frame.backgroundImage})` : "none"
        }`,
      }}
    >
      {frame.background}
      <div className="relative z-0">
        {allItems &&
          allItems.length > 0 &&
          allItems.map((item, index) => {
            return (
              <DraggableWrapper
                className={`${item?.hidden ? "hidden" : ""} ${
                  item?.locked ? "pointer-events-none user-select-none" : ""
                } ${item.active ? "active" : ""}
                 prevent-customize-card-blur movable-handle-parent`}
                initialPosition={item.position}
                key={item.id}
                item={item}
                index={index}
                zIndex={item?.zIndex || 10}
                isActive={item.active}
                mode={item.itemType}
                parentRef={parentRef}
                setShowCenterLine={setShowCenterLine}
                setAllItems={setAllItems}
                shouldBeSelected={shouldBeSelected}
                setHorizontalCentralLine={setHorizontalCentralLine}
                zoomLevel={zoomLevel}
                setIsAnyItemDragging={setIsAnyItemDragging}
              >
                {({ isDragging, startDrag, width, fontSize }) => (
                  <>
                    {item.itemType === "text" && (
                      <div
                        onMouseDown={(e) => {
                          if (item.active) return;
                          startDrag({ e, type: "move" });
                        }}
                        ref={(el) => {
                          if (el) {
                            itemsRefs.current[item.id] = el;
                          }
                        }}
                        contentEditable={item.contentEditable}
                        suppressContentEditableWarning
                        className={`
                        ${
                          isAnyItemDragging && !isDragging
                            ? "pointer-events-none"
                            : ""
                        }
                        ${item.active ? "active" : "!cursor-move"} ${
                          item.isPlaceholder ? "!text-green-600" : "text-black"
                        } ${
                          isDragging ? "movable-handle-hover" : ""
                        } movable-handle p-2 focus:outline-none whitespace-nowrap`}
                        onMouseUp={(e) => {
                          setTimeout(() => {
                            if (!shouldBeSelected.current) return;
                            handleFocus(e, index, item.id);
                          }, 0);
                        }}
                        style={{
                          fontSize: `${fontSize || defText.fontSize}px`,
                          textAlign: `${item?.textAlign || defText.textAlign}`,
                          color: `${item?.color || defText.color}`,
                          fontWeight: `${
                            item?.fontWeight || defText.fontWeight
                          }`,
                          fontStyle: `${item?.fontStyle || defText.fontStyle}`,
                          lineHeight: `${
                            item?.lineHeight ||
                            item?.lineHeight.toString() == "0"
                              ? item.lineHeight
                              : defText.lineHeight
                          }`,
                          letterSpacing: `${
                            item?.letterSpacing || defText.letterSpacing
                          }px`,
                          textTransform: `${
                            item?.textTransform || defText.textTransform
                          }`,
                          fontFamily: getFontFamily(
                            item?.fontFamily || defText.fontFamily
                          ),
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
                        className={`
                        ${
                          isAnyItemDragging && !isDragging
                            ? "pointer-events-none"
                            : ""
                        }
                        ${
                          item.active ? "active" : ""
                        } movable-handle !cursor-move p-2 focus:outline-none ${
                          isDragging ? "movable-handle-hover" : ""
                        }`}
                        style={{
                          width: `${width || defSticker?.width}px`,
                          transform: `scale(${
                            item?.scaleX || defSticker.scaleX
                          }, ${item?.scaleY || defSticker.scaleY})`,
                        }}
                        onMouseUp={(e) => {
                          setTimeout(() => {
                            if (!shouldBeSelected.current) return;

                            const newItem = allItems.map((s, i) => ({
                              ...s,
                              active: i === index,
                            }));

                            setAllItems(newItem);
                            setActiveID(item.id);
                          }, 0);
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
      {showCenterLine && (
        <div className="pointer-events-none z-10 absolute top-0 bottom-0 left-1/2 w-px border-l border-guide-line-color"></div>
      )}
      {horizontalCentralLine && (
        <div className="pointer-events-none z-10 absolute top-1/2 left-0 right-0 h-px border-t border-guide-line-color"></div>
      )}
    </div>
  );
}
