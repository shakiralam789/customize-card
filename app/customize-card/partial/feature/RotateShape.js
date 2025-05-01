import CcContext from "@/context/ccContext";
import React, { useContext } from "react";
import { RotateCcw } from "lucide-react";
import RangeFeature from "./RangeFeature";

export default function RotateShape() {
  
  const { stickers, setStickers, activeStickerIndex } = useContext(CcContext);

  return (
    <RangeFeature
      data={stickers}
      setData={setStickers}
      activeIndex={activeStickerIndex}
      propertyName="rotate"
      title="Rotate"
      min={0}
      max={360}
      step={1}
      defValue={0}
    >
      <RotateCcw />
    </RangeFeature>
  );
}
