"use client";
import React, { useLayoutEffect, useRef } from "react";
import { getCurvedTextHTML, managePosition } from "@/helper/helper";
import MainContentCom from "./MainContentCom";
import HandlerCom from "./HandlerCom";

export default function InvitationCard(props) {
  let contextProps = props.contextProps;
  let {
    allItems,
    activeID,
    setActiveID,
    itemsRefs,
    showCenterLine,
    parentRef,
    setAllItems,
    horizontalCentralLine,
    frame,
    handlerRefs,
    scrollRef,
  } = contextProps;

  function handlePrevItem(crrItem) {
    let position;

    if (activeID) {
      let prevHandler = handlerRefs.current[activeID];
      const parent = parentRef.current;
      position = managePosition({ idol: prevHandler, parent }, false);
    }
    
    setAllItems((prevItems) => {

    //  console.log('prev',prevItems);
     
      const newItems = prevItems.map((s) => {
        const updated = {
          ...s,
          active: s.id === crrItem?.id,
          position: {
            x:
              s.id == activeID && s.itemType === "text" && position
                ? position?.left
                : s.position.x,
            y:
              s.id == activeID && s.itemType === "text" && position
                ? position?.top
                : s.position.y,
          },
          width:
            s.id == activeID && s.itemType === "text" && position
              ? position?.width
              : s.width || "auto",
          height:
            s.id == activeID && s.itemType === "text" && position
              ? position?.height
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

  function handleContentChange() {
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
          allItems.map((item) => (
            <MainContentCom
              key={item.id + "main"}
              item={item}
              handleContentChange={handleContentChange}
              contextProps={contextProps}
              className={`prevent-customize-card-blur ${
                item?.hidden ? "hidden" : ""
              } ${item?.locked ? "pointer-events-none user-select-none" : ""} ${
                item.active ? "active" : ""
              }`}
            />
          ))}
      </div>
      <div className="w-0 h-0 absolute top-0 left-0 z-10">
        {allItems &&
          allItems.length > 0 &&
          allItems.map((item) => (
            <HandlerCom
              key={item.id + "handler"}
              item={item}
              contextProps={contextProps}
              className={`prevent-customize-card-blur ${
                item?.hidden ? "hidden" : ""
              } ${item?.locked ? "pointer-events-none user-select-none" : ""} ${
                item.active ? "active" : ""
              }`}
              onMouseUp={
                (item.itemType === "sticker" && handleStickerMouseup) ||
                handleTextMouseup ||
                null
              }
            />
          ))}
      </div>

      {showCenterLine && (
        <div className="pointer-events-none z-20 absolute top-0 bottom-0 left-1/2 w-px border-l border-guide-line-color"></div>
      )}
      {horizontalCentralLine && (
        <div className="pointer-events-none z-20 absolute top-1/2 left-0 right-0 h-px border-t border-guide-line-color"></div>
      )}
    </div>
  );
}
