import CcContext from "@/context/ccContext";
import { curvedText } from "@/helper/helper";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function TextCurveChange() {
  const { allItems, setAllItems, activeIndex, itemsRefs } =
    useContext(CcContext);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  function handleChange(value) {
    let newItem = [...allItems];
    if (!newItem[activeIndex].textCurve) {
      newItem[activeIndex].textCurve = 0;
    }

    newItem[activeIndex].textCurve = parseFloat(value);
    setAllItems(newItem);

    const element = itemsRefs.current[activeIndex];

    if (parseFloat(value) != 0) {
      element.innerHTML = curvedText({
        text: newItem[activeIndex].text,
        curveValue: parseFloat(value),
      });
    } else {
      element.innerHTML = newItem[activeIndex].text;
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
    if (activeIndex === null) return 0;
    return allItems[activeIndex]?.textCurve || 0;
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
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M11.402 12.875 7.435 5.39l-2.797 7.997m1-2.859 4.346-.328m-6.449 9.553c2.53-1.454 5.71-2.25 9.004-2.223s6.446.873 8.926 2.366m-5.75-14.744 2.485.345c1.006.14 1.803 1 1.76 2.016a1.946 1.946 0 0 1-2.213 1.85l-2.567-.356zm-.535 3.853 3.174.442c1.007.14 1.804 1 1.76 2.016a1.946 1.946 0 0 1-2.212 1.85l-3.258-.453z"
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
            <span className="text-xs">Curved text</span>
            <span className="text-xs font-medium">{getCurrent()}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={getCurrent()}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
