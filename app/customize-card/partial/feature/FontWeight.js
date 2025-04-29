import CcContext from "@/context/ccContext";
import { Bold } from "lucide-react";
import React, { useContext } from "react";

export default function FontWeight() {
  const { allText, setAllText, activeEditIndex } = useContext(CcContext);
  function changeFontWeight() {
    let newText = [...allText];
    newText[activeEditIndex].fontWeight =
      newText[activeEditIndex].fontWeight === "normal" ? "bold" : "normal";
    setAllText(newText);
  }
  return (
    <button
      onClick={changeFontWeight}
      className={`${
        allText[activeEditIndex]?.fontWeight === "bold" ? "active" : ""
      }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <Bold />
    </button>
  );
}
