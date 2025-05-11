"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import DraggableWrapper from "@/components/DraggableWrapper";
import Image from "next/image";
import { getCurvedTextHTML, getFontFamily } from "@/helper/helper";
import CurvedText from "./CurvedText";

export default function InvitationCard({ contextProps }) {
  const {
    zoomLevel,
    allItems,
    activeID,
    setActiveID,
    itemsRefs,
    shouldBeSelected,
    defText,
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
    handlerRefs,
    managePosition,
  } = contextProps;

  const scrollRef = useRef(null);
  function handlePrevItem(crrItem) {
    setAllItems((prevItems) => {
      let position;
      if (activeID) {
        let prevHandler = handlerRefs.current[activeID];
        const parent = parentRef.current;
        position = managePosition({ idol: prevHandler, parent }, true);
      }

      const newItems = prevItems.map((s) => {
        const updated = {
          ...s,
          active: s.id === crrItem?.id,
          top:
            s.id == activeID && s.itemType === "text"
              ? position?.top || 0
              : s.top,
          left:
            s.id == activeID && s.itemType === "text"
              ? position?.left || 0
              : s.left,
          width:
            s.id == activeID && s.itemType === "text"
              ? position?.width || "auto"
              : s.width || "auto",
          height:
            s.id == activeID && s.itemType === "text"
              ? position?.height || "auto"
              : s.height || "auto",
        };
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

  function handleTextMouseup({ e, item }) {
    handleFocus(e, item);
  }

  function handleStickerMouseup({ e, item }) {
    setAllItems((prev) => {
      return prev.map((s) => ({
        ...s,
        active: s.id === item.id,
      }));
    });

    setActiveID(item?.id);
  }

  function handleContentChange({ e }) {
    if (!activeID) return;

    let currentHandler = handlerRefs.current[activeID];
    let currentElement = itemsRefs.current[activeID];
    const parent = parentRef.current;

    managePosition({
      idol: currentElement,
      follower: currentHandler,
      parent,
      scrollParent: scrollRef.current,
    });
  }

  return (
    <div
      ref={parentRef}
      className="bg-no-repeat bg-cover relative shadow"
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
      <div
        ref={scrollRef}
        className="w-full h-full relative z-0 overflow-hidden"
      >
        {frame.background}
        {allItems &&
          allItems.length > 0 &&
          allItems.map((item, index) => {
            return (
              <DraggableWrapper
                className={`prevent-customize-card-blur ${
                  item?.hidden ? "hidden" : ""
                } ${
                  item?.locked ? "pointer-events-none user-select-none" : ""
                } ${item.active ? "active" : ""}`}
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
                handlerRefs={handlerRefs}
                onMouseUp={
                  (item.itemType === "sticker" && handleStickerMouseup) ||
                  handleTextMouseup ||
                  null
                }
              >
                {({ fontSize }) => (
                  <>
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
                        className={`${
                          item.isPlaceholder ? "!text-green-600" : "text-black"
                        }
                        focus:outline-none whitespace-nowrap carent-color editable-div`}
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
                  </>
                )}
              </DraggableWrapper>
            );
          })}
      </div>
      <div
        id="handler-portal"
        className="w-0 h-0 absolute top-0 left-0 z-10"
      ></div>
      {showCenterLine && (
        <div className="pointer-events-none z-20 absolute top-0 bottom-0 left-1/2 w-px border-l border-guide-line-color"></div>
      )}
      {horizontalCentralLine && (
        <div className="pointer-events-none z-20 absolute top-1/2 left-0 right-0 h-px border-t border-guide-line-color"></div>
      )}
    </div>
  );
}
