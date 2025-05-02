import CcContext from "@/context/ccContext";
import { Bold } from "lucide-react";
import React, { useContext } from "react";

export default function FontWeight() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);
  function changeFontWeight() {
    let newItem = [...allItems];
    newItem[activeIndex].fontWeight =
      newItem[activeIndex].fontWeight === "normal" ? "bold" : "normal";
    setAllItems(newItem);
  }
  return (
    <button
      onClick={changeFontWeight}
      className={`${
        allItems[activeIndex]?.fontWeight === "bold" ? "active" : ""
      }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <Bold />
    </button>
  );
}
