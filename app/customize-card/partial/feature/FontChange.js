import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function FontChange() {
  const { allItems, activeID, updateElementDimensionsByFont, setAllItems } =
    useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const [initialFontSize, setInitialFontSize] = useState(
    activeItem?.fontSize || 16
  );

  const fontRef = useRef(activeItem?.fontSize);

  function handleChange(value) {
    if (!activeID) return;
    
    let prevFont = fontRef.current;
    
    let currentFont = parseFloat(value);
    
    if (isNaN(currentFont)) return;
    
    currentFont = Math.round(currentFont);
    
    setInitialFontSize(currentFont);
    
    updateElementDimensionsByFont({
      prevFont,
      currentFont,
      activeItem,
    });
    
    fontRef.current = currentFont;
    
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              fontSize: currentFont,
            }
          : item
      )
    );
  }

  function handleSizeWithClick(dir) {
    if (!activeID) return;

    setInitialFontSize((prev) => {
      let current = prev + dir;
      return current;
    });

    let prevFont = fontRef.current;
    let currentFont = prevFont + dir;

    updateElementDimensionsByFont({
      prevFont,
      currentFont,
      activeItem,
    });

    fontRef.current = currentFont;
    
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              fontSize: currentFont,
            }
          : item
      )
    );
  }

  function handleInputKeyDown(e) {
    if (!activeID) return;
    
    let newValue = parseFloat(initialFontSize);

    const allowedKeys = ["ArrowUp", "ArrowDown", "Tab"];

    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      newValue = newValue + 1;
      handleChange(newValue);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      newValue = newValue - 1;
      handleChange(newValue);
    }
  }

  useEffect(() => {
    if (activeItem?.fontSize) {
      setInitialFontSize(activeItem.fontSize);
      fontRef.current = activeItem.fontSize;
    }
  }, [activeID, activeItem?.fontSize]);

  return (
    <div className="h-full flex border border-gray-200 divide-gray-200 rounded divide-x">
      <button
        onClick={() => handleSizeWithClick(-1)}
        className="cursor-pointer flex-1 flex items-center justify-center h-full hover:bg-gray-100"
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
      <div className="text-center flex-1 flex items-center">
        <input
          readOnly
          onKeyDown={handleInputKeyDown}
          value={Math.round(initialFontSize)}
          className="text-center w-full outline-none text-sm"
        />
      </div>
      <button
        onClick={() => handleSizeWithClick(1)}
        className="flex-1 cursor-pointer flex items-center justify-center h-full hover:bg-gray-100"
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