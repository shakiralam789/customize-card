import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { FlipVertical2 } from "lucide-react";
import React, { useContext } from "react";

export default function FlipVerticalShape() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function handleFlip() {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === activeID
          ? { ...item, scaleY: item.scaleY === 1 ? -1 : 1 }
          : item
      )
    );
  }

  return (
    <IconBtn
      onMouseDown={handleFlip}
      className={`${activeItem?.scaleY === -1 ? "active" : ""} `}
    >
      <FlipVertical2 />
    </IconBtn>
  );
}
