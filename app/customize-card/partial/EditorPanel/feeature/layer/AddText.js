import { Languages } from "lucide-react";
import { useContext } from "react";
import EditorPanelIcon from "../../Icon";
import CcContext from "@/context/ccContext";

export default function AddText() {
  const { addNewText } = useContext(CcContext);
  return (
    <>
      <EditorPanelIcon onClick={addNewText} title="Text">
        <Languages className="w-full h-full" />
      </EditorPanelIcon>
    </>
  );
}
