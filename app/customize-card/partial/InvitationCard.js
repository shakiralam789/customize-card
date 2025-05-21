"use client";
import React, { useEffect } from "react";
import { managePosition } from "@/helper/helper";
import MainContentCom from "./MainContentCom";
import HandlerCom from "./HandlerCom";
import useItemsMap from "@/hook/useItemMap";

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
    debouncedSetAllItems,
    mainRefs,
  } = contextProps;

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  function handlePrevItem(crrItem) {
    
    setAllItems((prevItems) => {
      let newItems = prevItems.map((s) => {
        
        const updated = {
          ...s,
          active: s.id === crrItem?.id,
        };

        if (s.itemType === "text") {
          return {
            ...updated,
            contentEditable: s.id === crrItem?.id && crrItem?.active,
          };
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
          return newItems.map((item) => ({
            ...item,
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

    let target = itemsRefs.current[item.id];
    
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

  useEffect(() => {
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

    mainRefs.current[activeID].style.width = "auto";
    mainRefs.current[activeID].style.height = "auto";

    requestAnimationFrame(() => {
      const { width, height, left, top } = managePosition({
        idol: currentElement,
        follower: currentHandler,
        scrollParent: scrollRef.current,
        item: activeItem || {},
      });

      let innerHTML = e.target.innerHTML == "<br>" ? "" : e.target.innerHTML;

      if (e.target.children.length == 1) {
        innerHTML = e.target.children[0].innerHTML;
      }

      debouncedSetAllItems((prev) => {
        return prev.map((s) => {
          return {
            ...s,
            text: s.id === activeID ? innerHTML : s.text,
            width: s.id === activeID ? width : s.width,
            height: s.id === activeID ? height : s.height,
            position:
              s.id === activeID ? { x: left, y: s.position.y } : s.position,
          };
        });
      });
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
