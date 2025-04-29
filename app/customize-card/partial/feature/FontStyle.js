import CcContext from "@/context/ccContext";
import { Italic } from "lucide-react";
import React, { useContext } from "react";

export default function FontStyle() {
  const { allText, setAllText, activeEditIndex } = useContext(CcContext);
  function changeFontStyle() {
    let newText = [...allText];
    newText[activeEditIndex].fontStyle =
      newText[activeEditIndex].fontStyle === "normal" ? "italic" : "normal";
    setAllText(newText);
  }
  return (
    <button
      onClick={changeFontStyle}
      className={`${
        allText[activeEditIndex]?.fontStyle === "italic" ? "active" : ""
      } size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <Italic />
    </button>
  );
}
