import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function FontChange() {
  const {
    allItems,
    activeID,
    mainRefs,
    updateElementDimensions,
    // fontChangeInProgress,
    updateElementState,
    // itemsRefs
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const [initialFontSize, setInitialFontSize] = useState(
    activeItem?.fontSize || 16
  );

  const fontRef = useRef(activeItem?.fontSize);

  function changeFontSize(value) {
    if (!activeID || !value) return;

    // fontChangeInProgress.current = true;

    const newSize = parseInt(value, 10);
    if (isNaN(newSize)) return;

    setInitialFontSize(newSize);
    fontRef.current = newSize;

    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.fontSize = `${newSize}px`;

      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      requestAnimationFrame(() => {
        let newPosition = updateElementDimensions();
        updateElementState(newPosition, fontRef.current);
      });
    }
  }

  function handleSizeWithClick(dir) {
    if (!activeID) return;

    // fontChangeInProgress.current = true;

    setInitialFontSize((prev) => {
      let current = prev + dir;
      fontRef.current = current;

      if (mainRefs.current[activeID]) {
        mainRefs.current[activeID].style.fontSize = `${current}px`;
        mainRefs.current[activeID].style.width = `auto`;
        mainRefs.current[activeID].style.height = `auto`;

        requestAnimationFrame(() => {
          let newPosition = updateElementDimensions();
          updateElementState(newPosition, fontRef.current);
        });
      }

      return current;
    });
  }

  // useEffect(() => {
  //   if (!activeID || fontChangeInProgress.current) return;
  //   updateElementDimensions((position) => {
  //     updateElementState(position, fontRef.current);
  //   });
  // }, [initialFontSize]);

  useEffect(() => {
    if (activeItem?.fontSize) {
      setInitialFontSize(activeItem.fontSize);
      fontRef.current = activeItem.fontSize;
    }
  }, [activeID, activeItem?.fontSize]);

  return (
    <div className="flex items-center border border-gray-200 divide-gray-200 rounded divide-x">
      <button
        onClick={() => handleSizeWithClick(-1)}
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
        onClick={() => handleSizeWithClick(1)}
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
