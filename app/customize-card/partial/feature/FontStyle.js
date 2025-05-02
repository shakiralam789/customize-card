import CcContext from "@/context/ccContext";
import { Italic } from "lucide-react";
import React, { useContext } from "react";

export default function FontStyle() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);
  function changeFontStyle() {
    let newItem = [...allItems];
    newItem[activeIndex].fontStyle =
      newItem[activeIndex].fontStyle === "normal" ? "italic" : "normal";
    setAllItems(newItem);
  }
  return (
    <button
      onClick={changeFontStyle}
      className={`${
        allItems[activeIndex]?.fontStyle === "italic" ? "active" : ""
      } size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <Italic />
    </button>
  );
}
