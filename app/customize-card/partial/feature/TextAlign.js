import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import React, { useContext } from "react";

export default function TextAlign() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function changeTextAlign(value) {
    if (activeID === null) return;

    setAllItems((prev) =>
      prev.map((item) =>
        item.id === activeID ? { ...item, textAlign: value } : item
      )
    );
  }
  return (
    <>
      <IconBtn
        onClick={() => changeTextAlign("left")}
        className={`flex-1 ${activeItem?.textAlign === "left" ? "active" : ""}`}
      >
        <AlignLeft />
      </IconBtn>
      <IconBtn
        onClick={() => changeTextAlign("center")}
        className={`flex-1 ${activeItem?.textAlign === "center" ? "active" : ""}`}
      >
        <AlignCenter />
      </IconBtn>
      <IconBtn
        onClick={() => changeTextAlign("right")}
        className={`flex-1 ${activeItem?.textAlign === "right" ? "active" : ""} `}
      >
        <AlignRight />
      </IconBtn>
    </>
  );
}
