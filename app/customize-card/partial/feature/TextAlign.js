import CcContext from "@/context/ccContext";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import React, { useContext } from "react";

export default function TextAlign() {
  const { allText, setAllText, activeEditIndex } = useContext(CcContext);

  function changeTextAlign(value) {
    let newText = [...allText];
    newText[activeEditIndex].textAlign = value;
    setAllText(newText);
  }
  return (
    <>
      <button
        onClick={() => changeTextAlign("left")}
        className={`${
          allText[activeEditIndex]?.textAlign === "left" ? "active" : ""
        } size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
      >
        <AlignLeft />
      </button>
      <button
        onClick={() => changeTextAlign("center")}
        className={`${
          allText[activeEditIndex]?.textAlign === "center" ? "active" : ""
        }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
      >
        <AlignCenter />
      </button>
      <button
        onClick={() => changeTextAlign("right")}
        className={`${
          allText[activeEditIndex]?.textAlign === "right" ? "active" : ""
        }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
      >
        <AlignRight />
      </button>
    </>
  );
}
