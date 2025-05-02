import CcContext from "@/context/ccContext";
import React, { useContext } from "react";

export default function ColorChange() {
  const { allItems, setAllItems, ignoreBlurRef, activeIndex } =
    useContext(CcContext);
  const handleColorInputClick = () => {
    ignoreBlurRef.current = true;
  };
  const handleColorChange = (e) => {
    if (activeIndex === null) return;

    ignoreBlurRef.current = true;

    setTimeout(() => {
      ignoreBlurRef.current = false;
    }, 100);

    const newItem = [...allItems];
    newItem[activeIndex].color = e.target.value;
    setAllItems(newItem);
  };
  return (
    <div className="size-7 flex items-center justify-center border border-gray-200 divide-gray-200">
      <input
        onChange={handleColorChange}
        onClick={handleColorInputClick}
        value={
          activeIndex !== null
            ? allItems[activeIndex]?.color || "#ffffff"
            : "#ffffff"
        }
        type="color"
        className="cursor-pointer size-5"
      ></input>
    </div>
  );
}
