import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { Italic } from "lucide-react";
import React, { useContext } from "react";

export default function FontStyle() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function changeFontStyle() {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === activeID
          ? {
              ...item,
              fontStyle: item.fontStyle === "italic" ? "normal" : "italic",
            }
          : item
      )
    );
  }
  return (
    <IconBtn
      onClick={changeFontStyle}
      className={`${activeItem?.fontStyle === "italic" ? "active" : ""} `}
    >
      <Italic />
    </IconBtn>
  );
}
