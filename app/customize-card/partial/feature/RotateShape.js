import { RotateCcw } from "lucide-react";
import RangeFeature from "./RangeFeature";

export default function RotateShape() {
  return (
    <RangeFeature
      propertyName="rotate"
      title="Rotate"
      min={0}
      max={360}
      step={1}
      defValue={0}
      unit="deg"
    >
      <RotateCcw />
    </RangeFeature>
  );
}
