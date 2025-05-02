import CcContext from "@/context/ccContext";
import { FlipHorizontal2 } from "lucide-react";
import React, { useContext } from "react";

export default function FlipShape() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);
  function handleFlip() {
    let newItem = [...allItems];
    newItem[activeIndex].scaleX =
      newItem[activeIndex].scaleX === 1 ? -1 : 1;
    setAllItems(newItem);
  }
  
  return (
    <button
      onMouseDown={handleFlip}
      className={`${
        allItems[activeIndex]?.scaleX === -1 ? "active" : ""
      }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <FlipHorizontal2 />
    </button>
  );
}
