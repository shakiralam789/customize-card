"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import DraggableWrapper from "@/components/DraggableWrapper";
import Image from "next/image";
import { getCurvedTextHTML, getFontFamily } from "@/helper/helper";
import CurvedText from "./CurvedText";

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
  function handlePrevItem(crrItem) {
    setAllItems((prevItems) => {
      const newItems = prevItems.map((s) => {
        const updated = { ...s, active: s.id === crrItem?.id };
        if (s.itemType === "text") {
          updated.contentEditable = s.id === crrItem?.id && crrItem?.active;
        }
        return updated;
      });

      let prevActiveItem = prevItems.find((s) => s.id === activeID);

      if (prevActiveItem?.itemType === "text") {
        const refEl = itemsRefs.current[activeID];

        if (
          !refEl ||
          refEl.innerHTML.trim() === "" ||
          refEl.innerHTML === "<br>"
        ) {
          return newItems.filter((item) => item.id !== activeID);
        } else {
          let refInitText = refEl.innerHTML;

          if (
            prevActiveItem?.itemType == "text" &&
            prevActiveItem?.textCurve &&
            prevActiveItem?.contentEditable
          ) {
            requestAnimationFrame(() => {
              refEl.innerHTML = getCurvedTextHTML(
                refEl.innerText || "",
                prevActiveItem?.textCurve
              );
            });
          }

          return newItems.map((item) => ({
            ...item,
            text:
              item.id === activeID &&
              !(prevActiveItem?.textCurve && !prevActiveItem?.contentEditable)
                ? refInitText
                : item.text,
            isPlaceholder: item.id === activeID ? false : item.isPlaceholder,
          }));
        }
      }

      return newItems;
    });

    setActiveID(crrItem?.id || null);
  }

  const handleFocus = (e, item) => {
    handlePrevItem(item);

    let plch = item?.isPlaceholder;

    let target = e.target.closest(".movable-handle");

    if (plch) {
      if (target) {
        target.innerHTML = "";
      }
      item.isPlaceholder = false;
    } else if (
      item?.textCurve &&
      item.itemType === "text" &&
      item.active &&
      !item.contentEditable
    ) {
      if (target) {
        target.innerHTML = item.text;
      }
    }
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

  useLayoutEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".prevent-customize-card-blur") || activeID == null)
        return;

      handlePrevItem();
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
                isAnyItemDragging={isAnyItemDragging}
                itemsRefs={itemsRefs}
                activeID={activeID}
              >
                {({ startDrag, fontSize }) => (
                  <>
                    {item.itemType === "text" && (
                      <div
                        onMouseDown={(e) => {
                          if (item.active && item?.contentEditable) return;
                          startDrag({ e, type: "move" });
                        }}
                        ref={(el) => {
                          if (el) {
                            itemsRefs.current[item.id] = el;
                          } else {
                            delete itemsRefs.current[item.id];
                          }
                        }}
                        contentEditable={item.contentEditable}
                        suppressContentEditableWarning
                        className={`${
                          item.isPlaceholder ? "!text-green-600" : "text-black"
                        }
                        ${!item?.contentEditable ? "!cursor-move" : ""}
                        focus:outline-none whitespace-nowrap`}
                        onMouseUp={(e) => {
                          setTimeout(() => {
                            if (!shouldBeSelected.current) return;
                            handleFocus(e, item);
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
                        {/* {!item?.textCurve && !item.contentEditable ? (
                          <CurvedText
                            radius={item.textCurve}
                            text={item.text}
                          />
                        ) : (
                          "Enter text..."
                        )} */}
                        Enter text...
                      </div>
                    )}

                    {item.itemType === "sticker" && (
                      <div
                        onMouseDown={(e) => {
                          startDrag({ e, type: "move" });
                        }}
                        ref={(el) => {
                          if (el) {
                            itemsRefs.current[item.id] = el;
                          } else {
                            delete itemsRefs.current[item.id]; // Clean up
                          }
                        }}
                        className={`!cursor-move focus:outline-none`}
                        onMouseUp={(e) => {
                          setTimeout(() => {
                            if (!shouldBeSelected.current) return;
                            setAllItems((prev) => {
                              return prev.map((s) => ({
                                ...s,
                                active: s.id === item.id,
                                contentEditable: s.id === item.id,
                              }));
                            });

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
