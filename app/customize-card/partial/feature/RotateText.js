import CcContext from "@/context/ccContext";
import React, { useContext } from "react";
import { RotateCcw } from "lucide-react";
import RangeFeature from "./RangeFeature";

export default function RotateText() {
  const { allItems, setAllItems, activeIndex } = useContext(CcContext);

  return (
    <RangeFeature
      data={allItems}
      setData={setAllItems}
      activeIndex={activeIndex}
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
