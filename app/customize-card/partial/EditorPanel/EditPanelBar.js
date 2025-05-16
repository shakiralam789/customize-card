import React, { useState } from "react";
import Layer from "./feeature/layer/Layer";
import AddText from "./feeature/layer/AddText";
import AddSticker from "./feeature/layer/AddSticker";

export default function EditPanelBar() {
  const [isOpen, setOpen] = useState("");

  return (
    <div className="prevent-customize-card-blur z-40 py-4 h-[calc(100vh-88px)] rounded-xl text-gray-600 top-[70px] left-4 w-[80px] fixed overflow-y-auto bg-white shadow border-r border-gray-300">
      <div className="space-y-4">
        <Layer isOpen={isOpen} setOpen={setOpen} />
        <AddText />
        <AddSticker isOpen={isOpen} setOpen={setOpen} />
      </div>
    </div>
  );
}
