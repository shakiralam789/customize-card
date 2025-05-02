import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { FlipHorizontal2 } from "lucide-react";
import React, { useContext } from "react";

export default function FlipShape() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function handleFlip() {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === activeID
          ? { ...item, scaleX: item.scaleX === 1 ? -1 : 1 }
          : item
      )
    );
  }

  return (
    <IconBtn
      onMouseDown={handleFlip}
      className={activeItem?.scaleX === -1 ? "active" : ""}
    >
      <FlipHorizontal2 />
    </IconBtn>
  );
}
