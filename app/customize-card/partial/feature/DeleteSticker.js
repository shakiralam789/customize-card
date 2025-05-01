import CcContext from "@/context/ccContext";
import { TrashIcon } from "lucide-react";
import React, { useContext } from "react";

export default function DeleteSticker() {
  const { stickers, setStickers, activeStickerIndex, setActiveStickerIndex } =
    useContext(CcContext);

  function deleteField() {
    let newSticker = [...stickers];
    newSticker.splice(activeStickerIndex, 1);
    setStickers(newSticker);
    setActiveStickerIndex(null);
  }
  return (
    <button
      onClick={deleteField}
      className="size-8 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-2"
    >
      <TrashIcon />
    </button>
  );
}
