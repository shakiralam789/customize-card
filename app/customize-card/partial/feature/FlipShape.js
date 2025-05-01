import CcContext from "@/context/ccContext";
import { FlipHorizontal2 } from "lucide-react";
import React, { useContext } from "react";

export default function FlipShape() {
  const { stickers, setStickers, activeStickerIndex } = useContext(CcContext);
  function handleFlip() {
    let newSticker = [...stickers];
    newSticker[activeStickerIndex].scaleX =
      newSticker[activeStickerIndex].scaleX === 1 ? -1 : 1;
    setStickers(newSticker);
  }
  
  return (
    <button
      onMouseDown={handleFlip}
      className={`${
        stickers[activeStickerIndex]?.scaleX === -1 ? "active" : ""
      }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <FlipHorizontal2 />
    </button>
  );
}
