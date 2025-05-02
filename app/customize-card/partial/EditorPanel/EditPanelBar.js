import { Layers } from "lucide-react";
import React from "react";
import Layer from "./feeature/layer/Layer";

export default function EditPanelBar() {
  return (
    <div className="z-40 py-4 h-[calc(100vh-54px)] text-gray-600 top-[54px] left-0 w-[80px] fixed overflow-y-auto bg-white shadow border-r border-gray-300">
      <div className="">
        <Layer />
      </div>
    </div>
  );
}
