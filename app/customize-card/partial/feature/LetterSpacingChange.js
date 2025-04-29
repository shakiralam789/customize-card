import CcContext from "@/context/ccContext";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function LetterSpacingChange() {
  const { allText, setAllText, ignoreBlurRef, activeEditIndex } =
    useContext(CcContext);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  function handleChange(value) {
    let newText = [...allText];
    if (!newText[activeEditIndex].letterSpacing) {
      newText[activeEditIndex].letterSpacing = 0;
    }
    newText[activeEditIndex].letterSpacing = parseFloat(value);
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
    if (activeEditIndex === null) return 0;
    return allText[activeEditIndex]?.letterSpacing || 0;
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
          width="24"
          height="24"
          fill="none"
          viewBox="0 1 24 24"
          className="icon"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m16.28 15.916 2.835 2.835m0 0-2.835 2.835m2.835-2.835H5.885m0 0 2.835-2.835M5.885 18.75l2.835 2.835m3.202-9.01-3.51-8.033-3.51 8.034m15.196-8.034-3.51 8.034-3.51-8.034m-6.92 5.162h4.51"
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
            <span className="text-xs">Letter Spacing</span>
            <span className="text-xs font-medium">{getCurrent()}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={getCurrent()}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs">1</span>
            <span className="text-xs">10</span>
          </div>
        </div>
      )}
    </div>
  );
}
