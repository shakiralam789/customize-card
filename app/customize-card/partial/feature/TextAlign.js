import CcContext from "@/context/ccContext";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import React, { useContext } from "react";

export default function TextAlign() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);

  function changeTextAlign(value) {
    let newItem = [...allItems];
    newItem[activeIndex].textAlign = value;
    setAllItems(newItem);
  }
  return (
    <>
      <button
        onClick={() => changeTextAlign("left")}
        className={`${
          allItems[activeIndex]?.textAlign === "left" ? "active" : ""
        } size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
      >
        <AlignLeft />
      </button>
      <button
        onClick={() => changeTextAlign("center")}
        className={`${
          allItems[activeIndex]?.textAlign === "center" ? "active" : ""
        }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
      >
        <AlignCenter />
      </button>
      <button
        onClick={() => changeTextAlign("right")}
        className={`${
          allItems[activeIndex]?.textAlign === "right" ? "active" : ""
        }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
      >
        <AlignRight />
      </button>
    </>
  );
}
