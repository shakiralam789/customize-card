import { Layers } from "lucide-react";
import { useState } from "react";
import EditorPanelIcon from "../../Icon";
import LayerPanel from "./LayerPanel";

export default function Layer() {
  const [show, setOpen] = useState(false);
  return (
    <>
      <EditorPanelIcon
        className={show ? "active" : ""}
        onClick={() => setOpen(true)}
        title="Layers"
      >
        <Layers />
      </EditorPanelIcon>
      <LayerPanel show={show} onClose={() => setOpen(false)} />
    </>
  );
}
