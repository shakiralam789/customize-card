import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import React, { use, useContext, useEffect, useRef, useState } from "react";

export default function RangeFeature({
  title = "",
  propertyName,
  children,
  min = 0,
  max = 100,
  step = 1,
  defValue = 0,
  unit = "em",
  onHandleChange = () => {},
}) {
  const {
    updateElementDimensions,
    mainRefs,
    handlerRefs,
    allItems,
    setAllItems,
    activeID,
    itemsRefs,
  } = useContext(CcContext);

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const [initialValue, setInitialValue] = useState(getCurrent());
  const positionRef = useRef(activeItem?.position || {});

  function handleChange(value) {
    if (!activeID || !value) return;

    const newValue = value;
    if (isNaN(newValue)) return;

    setInitialValue(newValue);

    if (mainRefs.current[activeID]) {
      if (propertyName == "rotate") {
        mainRefs.current[
          activeID
        ].style.transform = `rotate(${newValue}deg) scaleX(${
          activeItem?.scaleX || 1
        }) scaleY(${activeItem?.scaleY || 1})`;

        handlerRefs.current[
          activeID
        ].style.transform = `rotate(${newValue}deg)`;
      } else {
        itemsRefs.current[activeID].style[propertyName] = `${newValue}${unit}`;
      }

      if (propertyName != "rotate") {
        mainRefs.current[activeID].style.width = `auto`;
        mainRefs.current[activeID].style.height = `auto`;

        requestAnimationFrame(() => {
          positionRef.current = updateElementDimensions();
        });
      }
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
        item.id === activeID
          ? {
              ...item,
              [propertyName]: value,
              width: positionRef.current?.width || activeItem?.width,
              height: positionRef.current.height || activeItem?.height,
              // position: { y: position.top, x: position.left },
              // fontSize: fontSize || item.fontSize,
            }
          : item
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

  useEffect(() => {
    if (activeItem?.[propertyName]) {
      setInitialValue(activeItem?.[propertyName]);
    }
  }, [activeID, activeItem?.[propertyName]]);

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
            <span className="text-xs font-medium">
              {initialValue}
              {unit}
            </span>
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
