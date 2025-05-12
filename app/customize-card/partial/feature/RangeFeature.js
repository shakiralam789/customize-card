import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function RangeFeature({
  title = "",
  propertyName,
  children,
  min = 0,
  max = 100,
  step = 1,
  defValue = 1.5,
  unit = "px",
  onHandleChange = () => {},
}) {
  const {
    updateElementDimensions,
    mainRefs,
    fontChangeInProgress,
    allItems,
    setAllItems,
    activeID,
    updateElementState,
    itemsRefs,
  } = useContext(CcContext);

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const [initialValue, setInitialValue] = useState(getCurrent());

  function handleChange(value) {
    if (!activeID || !value) return;

    fontChangeInProgress.current = true;

    const newValue = parseInt(value, 10);
    if (isNaN(newValue)) return;

    setInitialValue(newValue);

    if (mainRefs.current[activeID]) {
      itemsRefs.current[activeID].style[propertyName] = `${newValue}${unit}`;

      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      requestAnimationFrame(() => {
        updateElementDimensions((position) => {
          updateElementState(position);
        });
      });
    }

    if (onHandleChange) {
      onHandleChange({ value, activeItem });
    }
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  function handleDragEnd(value) {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID ? { ...item, [propertyName]: value } : item
      )
    );
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function getCurrent() {
    if (activeID === null || !propertyName) return defValue;
    const value = activeItem?.[propertyName];
    return value !== undefined && value !== null ? value : defValue;
  }

  return (
    <div className="relative">
      <IconBtn onClick={togglePopup} className={`${showPopup ? "active" : ""}`}>
        {children}
      </IconBtn>

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute top-full mt-1 left-0 bg-white shadow-md rounded border border-gray-200 p-3 z-50 flex flex-col"
          style={{ width: "200px" }}
        >
          <div className="flex justify-between mb-1">
            <span className="text-xs">{title}</span>
            <span className="text-xs font-medium">{initialValue}{unit}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={initialValue}
            onChange={(e) => handleChange(e.target.value)}
            onPointerUp={(e) => handleDragEnd(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs">{min}</span>
            <span className="text-xs">{max}</span>
          </div>
        </div>
      )}
    </div>
  );
}
