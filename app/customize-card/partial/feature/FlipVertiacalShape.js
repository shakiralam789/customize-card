import CcContext from "@/context/ccContext";
import { FlipVertical2 } from "lucide-react";
import React, { useContext } from "react";

export default function FlipVerticalShape() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);
  function handleFlip() {
    let newItem = [...allItems];
    newItem[activeIndex].scaleY =
      newItem[activeIndex].scaleY === 1 ? -1 : 1;
    setAllItems(newItem);
  }

  return (
    <button
      onMouseDown={handleFlip}
      className={`${
        allItems[activeIndex]?.scaleY === -1 ? "active" : ""
      }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <FlipVertical2 />
    </button>
  );
}
