import CcContext from "@/context/ccContext";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function LineHeightChange() {
  const { allText, setAllText, ignoreBlurRef, activeEditIndex } =
    useContext(CcContext);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  function handleChange(value) {
    let newText = [...allText];
    if (!newText[activeEditIndex].lineHeight) {
      newText[activeEditIndex].lineHeight = 1.5;
    }
    newText[activeEditIndex].lineHeight = parseFloat(value);
    setAllText(newText);
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
    ignoreBlurRef.current = true;
    setTimeout(() => {
      ignoreBlurRef.current = false;
    }, 100);
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
    if (activeEditIndex === null) return 1.5;
    return allText[activeEditIndex]?.lineHeight || 1.5;
  };

  return (
    <div className="relative">
      <button
        onClick={togglePopup}
        className={`size-7 flex items-center justify-center border border-gray-200 ${
          showPopup ? "bg-gray-100" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="24"
          fill="none"
          className="icon"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m4.5 8.22 2.835-2.835m0 0L10.17 8.22M7.335 5.385v13.23m0 0L4.5 15.78m2.835 2.835 2.835-2.835m3.848-3.686H20.5m-6.483 5.708H20.5M14.018 6.193H20.5"
          ></path>
        </svg>
      </button>

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute top-full mt-1 left-0 bg-white shadow-md rounded border border-gray-200 p-3 z-50 flex flex-col"
          style={{ width: "200px" }}
        >
          <div className="flex justify-between mb-1">
            <span className="text-xs">Line Height</span>
            <span className="text-xs font-medium">{getCurrent()}</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={getCurrent()}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs">1.0</span>
            <span className="text-xs">3.0</span>
          </div>
        </div>
      )}
    </div>
  );
}
