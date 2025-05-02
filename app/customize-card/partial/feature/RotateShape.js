import CcContext from "@/context/ccContext";
import React, { useContext } from "react";
import { RotateCcw } from "lucide-react";
import RangeFeature from "./RangeFeature";

export default function RotateShape() {
  
  const { allItems, setAllItems, activeID } = useContext(CcContext);

  return (
    <RangeFeature
      data={allItems}
      setData={setAllItems}
      activeID={activeID}
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
