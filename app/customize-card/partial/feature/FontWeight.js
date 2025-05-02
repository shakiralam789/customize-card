import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { Bold } from "lucide-react";
import React, { useContext } from "react";

export default function FontWeight() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function changeFontWeight() {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === activeID
          ? {
              ...item,
              fontWeight: item.fontWeight === "bold" ? "normal" : "bold",
            }
          : item
      )
    );
  }
  return (
    <IconBtn
      onClick={changeFontWeight}
      className={`${activeItem?.fontWeight === "bold" ? "active" : ""}`}
    >
      <Bold />
    </IconBtn>
  );
}
