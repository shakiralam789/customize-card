import React, { useEffect, useRef, useState } from "react";

export default function RangeFeature({
  data,
  setData,
  activeIndex,
  title = "",
  propertyName,
  children,
  min = 0,
  max = 100,
  step = 1,
  defValue = 1.5,
  onHandleChange = () => {},
}) {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  function handleChange(value) {
    let newData = [...data];
    if (!newData[activeIndex][propertyName]) {
      newData[activeIndex][propertyName] = defValue;
    }
    newData[activeIndex][propertyName] = parseFloat(value);
    setData(newData);

    if (onHandleChange) {
      onHandleChange(value);
    }
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

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

  const getCurrent = () => {
    if (activeIndex === null || !propertyName) return defValue;
    const value = data?.[activeIndex]?.[propertyName];
    return value !== undefined && value !== null ? value : defValue;
  };

  return (
    <div className="relative">
      <button
        onClick={togglePopup}
        className={`size-7 flex items-center justify-center border border-gray-200 ${
          showPopup ? "bg-gray-100" : ""
        }`}
      >
        {children}
      </button>

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute top-full mt-1 left-0 bg-white shadow-md rounded border border-gray-200 p-3 z-50 flex flex-col"
          style={{ width: "200px" }}
        >
          <div className="flex justify-between mb-1">
            <span className="text-xs">{title}</span>
            <span className="text-xs font-medium">{getCurrent()}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={getCurrent()}
            onChange={(e) => handleChange(e.target.value)}
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
