import CcContext from "@/context/ccContext";
import { managePosition } from "@/helper/helper";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function FontChange() {
  const {
    allItems,
    setAllItems,
    activeID,
    mainRefs,
    itemsRefs,
    handlerRefs,
    parentRef,
    scrollRef,
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const fontChangeInProgress = useRef(false);

  const [initialFontSize, setInitialFontSize] = useState(
    activeItem?.fontSize || 16
  );
  const fontRef = useRef(activeItem?.fontSize);

  function changeFontSize(value) {
    if (!activeID || !value) return;

    fontChangeInProgress.current = true;

    const newSize = parseInt(value, 10);
    if (isNaN(newSize)) return;

    setInitialFontSize(newSize);
    fontRef.current = newSize;

    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.fontSize = `${newSize}px`;

      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      requestAnimationFrame(() => {
        updateElementDimensions();
      });
    }
  }

  function increaseFontSize() {
    if (!activeID) return;

    fontChangeInProgress.current = true;

    setInitialFontSize((prev) => {
      let current = prev + 1;
      fontRef.current = current;

      if (mainRefs.current[activeID]) {
        mainRefs.current[activeID].style.fontSize = `${current}px`;
        mainRefs.current[activeID].style.width = `auto`;
        mainRefs.current[activeID].style.height = `auto`;

        requestAnimationFrame(() => {
          updateElementDimensions();
        });
      }

      return current;
    });
  }

  function decreaseFontSize() {
    if (!activeID) return;

    fontChangeInProgress.current = true;

    setInitialFontSize((prev) => {
      let current = prev - 1;
      fontRef.current = current;

      if (mainRefs.current[activeID]) {
        mainRefs.current[activeID].style.fontSize = `${current}px`;
        mainRefs.current[activeID].style.width = `auto`;
        mainRefs.current[activeID].style.height = `auto`;

        requestAnimationFrame(() => {
          updateElementDimensions();
        });
      }

      return current;
    });
  }

  // Helper function to update dimensions after font change
  function updateElementDimensions() {
    if (!activeID) return;

    let currentHandler = handlerRefs.current[activeID];
    let currentElement = itemsRefs.current[activeID];
    const parent = parentRef.current;

    if (!currentElement || !parent) return;

    // Get new position based on content
    const position = managePosition({
      idol: currentElement,
      follower: currentHandler,
      parent,
      scrollParent: scrollRef.current,
    });

    // Update state with new dimensions
    updateElementState(position);
  }

  // Helper function to update the element state
  function updateElementState(position) {
    if (!activeID || !position) return;

    // Set explicit dimensions after calculation
    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.width = `${position.width}px`;
      mainRefs.current[activeID].style.height = `${position.height}px`;
    }

    if (handlerRefs.current[activeID]) {
      handlerRefs.current[activeID].style.width = `${position.width}px`;
      handlerRefs.current[activeID].style.height = `${position.height}px`;
    }

    // Update the global state with new dimensions
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              width: position.width,
              height: position.height,
              position: { y: position.top, x: position.left },
              fontSize: fontRef.current,
            }
          : item
      )
    );

    // Clear the flag once state update is complete
    fontChangeInProgress.current = false;
  }

  useEffect(() => {
    // Only run this effect if the font size changes
    if (!activeID || fontChangeInProgress.current) return;

    // Update dimensions whenever initialFontSize changes
    updateElementDimensions();
  }, [initialFontSize]);

  useEffect(() => {
    if (activeItem?.fontSize) {
      setInitialFontSize(activeItem.fontSize);
      fontRef.current = activeItem.fontSize;
    }
  }, [activeID, activeItem?.fontSize]);

  return (
    <div className="flex items-center border border-gray-200 divide-gray-200 rounded divide-x">
      <button
        onClick={decreaseFontSize}
        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 13H5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="px-3 py-1 flex items-center">
        <input
          onChange={(e) => changeFontSize(e.target.value)}
          value={initialFontSize}
          className="w-4 outline-none text-sm"
        />
      </div>
      <button
        onClick={increaseFontSize}
        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
