import CcContext from "@/context/ccContext";
import { FlipVertical2 } from "lucide-react";
import React, { useContext } from "react";

export default function FlipVerticalShape() {
  const { stickers, setStickers, activeStickerIndex } = useContext(CcContext);
  function handleFlip() {
    let newSticker = [...stickers];
    newSticker[activeStickerIndex].scaleY =
      newSticker[activeStickerIndex].scaleY === 1 ? -1 : 1;
    setStickers(newSticker);
  }

  return (
    <button
      onMouseDown={handleFlip}
      className={`${
        stickers[activeStickerIndex]?.scaleY === -1 ? "active" : ""
      }  size-7 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center border border-gray-200`}
    >
      <FlipVertical2 />
    </button>
  );
}
