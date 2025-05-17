import CcContext from "@/context/ccContext";
import { limitDecimalPlaces } from "@/helper/helper";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function OpacityRange() {
  const { allItems, activeID, setAllItems, mainRefs, itemsRefs } =
    useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const [opacityPercent, setOpacityPercent] = useState(getInitialOpacityPercent());
  const opacityRef = useRef(activeItem?.opacity ?? 1);

  function getInitialOpacityPercent() {
    const decimal = activeItem?.opacity ?? 1;
    return Math.round(decimal * 100);
  }

  function percentToDecimal(percent) {
    return percent / 100;
  }

  function handleTempChange(percentValue) {
    if (!activeID) return;

    let newOpacityPercent = parseFloat(percentValue);

    if (isNaN(newOpacityPercent)) return;

    newOpacityPercent = Math.max(0, Math.min(100, newOpacityPercent));

    newOpacityPercent = Math.round(newOpacityPercent);

    setOpacityPercent(newOpacityPercent);

    const decimalOpacity = percentToDecimal(newOpacityPercent);
    
    const limitedDecimalOpacity = limitDecimalPlaces(decimalOpacity);
    
    opacityRef.current = limitedDecimalOpacity;

    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.opacity = limitedDecimalOpacity;
    }
  }

  function handleFinalChange(percentValue) {
    if (!activeID) return;

    handleTempChange(percentValue);
    
    const limitedDecimalOpacity = opacityRef.current;
    
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              opacity: limitedDecimalOpacity,
            }
          : item
      )
    );
  }

  function handleSliderChange(e) {
    handleTempChange(e.target.value);
  }

  function handleSliderDragEnd(e) {
    handleFinalChange(e.target.value);
  }

  function handleStepClick(dir) {
    if (!activeID) return;

    const newPercentValue = opacityPercent + (dir * 10);
    
    handleFinalChange(newPercentValue);
  }

  function handleInputKeyDown(e) {
    if (!activeID) return;

    const step = 10;
    const allowedKeys = ["ArrowUp", "ArrowDown", "Tab"];

    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = Math.min(100, opacityPercent + step);
      handleFinalChange(newValue);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = Math.max(0, opacityPercent - step);
      handleFinalChange(newValue);
    }
  }

  useEffect(() => {
    if (activeItem) {
      const decimalOpacity = activeItem?.opacity ?? 1;
      
      const percentOpacity = Math.round(decimalOpacity * 100);
      
      setOpacityPercent(percentOpacity);
      opacityRef.current = decimalOpacity;

      if (activeID && mainRefs.current[activeID]) {
        mainRefs.current[activeID].style.opacity = decimalOpacity;
      }
    } else {
      setOpacityPercent(100);
      opacityRef.current = 1;
    }
  }, [activeID, activeItem?.opacity, mainRefs]);

  return (
    <div className="p-2 border border-gray-200 rounded bg-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-700">Opacity</span>
        <div className="flex items-center">
          <button
            onClick={() => handleStepClick(-1)}
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-l focus:outline-none hover:bg-gray-100"
            disabled={opacityPercent <= 0}
          >
            <span className="text-xs">−</span>
          </button>
          <div className="flex items-center border border-l-0 border-r-0 border-gray-300 h-6">
            <input
              type="text"
              readOnly
              value={opacityPercent}
              onKeyDown={handleInputKeyDown}
              className="w-8 h-full text-xs text-right border-0 focus:outline-none px-1"
            />
            <span className="text-xs pr-1">%</span>
          </div>
          <button
            onClick={() => handleStepClick(1)}
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-r focus:outline-none hover:bg-gray-100"
            disabled={opacityPercent >= 100}
          >
            <span className="text-xs">+</span>
          </button>
        </div>
      </div>

      <div className="relative h-6 mx-2">
        <div className="absolute inset-0 px-4">
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"
            style={{
              background: "linear-gradient(to right, transparent, #000)",
            }}
          ></div>

          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-full transform -translate-y-1/2"
            style={{ width: `${opacityPercent}%` }}
          ></div>

          <div
            className="absolute w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-md"
            style={{
              left: `${opacityPercent}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={opacityPercent}
          onChange={handleSliderChange}
          onMouseUp={handleSliderDragEnd}
          onTouchEnd={handleSliderDragEnd}
          className="w-full h-6 absolute top-0 left-0 opacity-0 cursor-pointer z-10"
        />
      </div>

      <div className="flex justify-between mt-1 px-4">
        <span className="text-xs text-gray-500">0%</span>
        <span className="text-xs text-gray-500">100%</span>
      </div>
    </div>
  );
}