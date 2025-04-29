import CcContext from "@/context/ccContext";
import React, { useContext } from "react";

export default function ColorChange() {
  const { allText, setAllText, ignoreBlurRef, activeEditIndex } =
    useContext(CcContext);
  const handleColorInputClick = () => {
    ignoreBlurRef.current = true;
  };
  const handleColorChange = (e) => {
    if (activeEditIndex === null) return;

    ignoreBlurRef.current = true;

    setTimeout(() => {
      ignoreBlurRef.current = false;
    }, 100);

    const newText = [...allText];
    newText[activeEditIndex].color = e.target.value;
    setAllText(newText);
  };
  return (
    <div className="size-7 flex items-center justify-center border border-gray-200 divide-gray-200">
      <input
        onChange={handleColorChange}
        onClick={handleColorInputClick}
        value={
          activeEditIndex !== null
            ? allText[activeEditIndex]?.color || "#ffffff"
            : "#ffffff"
        }
        type="color"
        className="cursor-pointer size-5"
      ></input>
    </div>
  );
}
