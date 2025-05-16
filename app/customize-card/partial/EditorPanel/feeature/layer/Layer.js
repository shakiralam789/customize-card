import { Layers } from "lucide-react";
import { useState } from "react";
import EditorPanelIcon from "../../Icon";
import LayerPanel from "./LayerPanel";

export default function Layer({ isOpen, setOpen }) {
  return (
    <>
      <EditorPanelIcon
        className={(isOpen == "layers" ? "active" : "")}
        onClick={() => setOpen("layers")}
        title="Layers"
      >
        <Layers className="w-full h-full" />
      </EditorPanelIcon>

      <LayerPanel show={isOpen} onClose={() => setOpen("")} />
    </>
  );
}
