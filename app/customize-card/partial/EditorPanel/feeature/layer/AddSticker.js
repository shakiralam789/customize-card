import { Sticker } from "lucide-react";
import EditorPanelIcon from "../../Icon";
import StickerDrawerContent from "../../../StickerDrawerContent";
import PanelDrawer from "../../PanelDrawer";
import StickerContextProvider from "@/context/contextSelector/sticker/StickerContextProvider";

const AddSticker = ({ isOpen, setOpen }) => {
  return (
    <>
      <EditorPanelIcon
        className={isOpen == "layers" ? "active" : ""}
        onClick={() => setOpen("sticker")}
        title="Sticker"
      >
        <Sticker className="w-full h-full" />
      </EditorPanelIcon>
      <PanelDrawer
        title={"Sticker"}
        show={isOpen == "sticker"}
        onClose={() => setOpen("")}
      >
        <StickerContextProvider>
          <StickerDrawerContent />
        </StickerContextProvider>
      </PanelDrawer>
    </>
  );
};

export default AddSticker;
