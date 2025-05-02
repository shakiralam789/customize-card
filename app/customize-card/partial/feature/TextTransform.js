import CcContext from "@/context/ccContext";
import { CaseUpper } from "lucide-react";
import React, { useContext } from "react";

export default function TextTransform() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);

  function changeTextTransform(value) {
    let newItem = [...allItems];
    newItem[activeIndex].textTransform =
      newItem[activeIndex].textTransform === "none" ? value : "none";
    setAllItems(newItem);
  }
  return (
    <button
      onClick={() => changeTextTransform("uppercase")}
      className={`${
        allItems[activeIndex]?.textTransform === "uppercase" ? "active" : ""
      } size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <CaseUpper />
    </button>
  );
}
