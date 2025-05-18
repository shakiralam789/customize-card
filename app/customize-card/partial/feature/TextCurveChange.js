import CcContext from "@/context/ccContext";
import React, { useContext, useRef } from "react";
import RangeFeature from "./RangeFeature";
import { applyCurvedText } from "@/helper/helper";

export default function TextCurveChange() {
  const { activeID,mainRefs,handlerRefs, itemsRefs, updatePositionState } = useContext(CcContext);

  const position = useRef({});

  function handleCurve({ value, activeItem }) {
    if (activeID === null) return;
    const element = itemsRefs.current[activeItem.id];
    const result = applyCurvedText(element, activeItem?.text, value);
    result.getMeasurements().then(({ width, height }) => {
      position.current = { width, height };

      mainRefs.current[activeID].style.width = `${width}px`;
      mainRefs.current[activeID].style.height = `${height}px`;
      handlerRefs.current[activeID].style.width = `${width}px`;
      handlerRefs.current[activeID].style.height = `${height}px`;
    });
  }

  function handleDragend() {
    const { width, height } = position.current;
    updatePositionState({ width, height }, activeID);
  }

  return (
    <RangeFeature
      propertyName="textCurve"
      title="Text curve"
      min={-100}
      max={100}
      step={1}
      onHandleChange={handleCurve}
      onDragEnd={handleDragend}
      defValue={0}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
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
    </RangeFeature>
  );
}
