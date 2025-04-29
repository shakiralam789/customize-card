import CcContext from "@/context/ccContext";
import { CaseUpper } from "lucide-react";
import React, { useContext } from "react";

export default function TextTransform() {
  const { allText, setAllText, activeEditIndex } = useContext(CcContext);

  function changeTextTransform(value) {
    let newText = [...allText];
    newText[activeEditIndex].textTransform =
      newText[activeEditIndex].textTransform === "none" ? value : "none";
    setAllText(newText);
  }
  return (
    <button
      onClick={() => changeTextTransform("uppercase")}
      className={`${
        allText[activeEditIndex]?.textTransform === "uppercase" ? "active" : ""
      } size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <CaseUpper />
    </button>
  );
}
