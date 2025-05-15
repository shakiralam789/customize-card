import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { Bold } from "lucide-react";
import React, { useContext } from "react";

export default function FontWeight() {
  const {
    allItems,
    activeID,
    updateElementState,
    updateElementDimensions,
    mainRefs,
    itemsRefs,
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function changeFontWeight() {
    if (mainRefs.current[activeID]) {
      itemsRefs.current[activeID].style.fontWeight =
        activeItem.fontWeight === "bold" ? "normal" : "bold";
      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      let newPosition = updateElementDimensions(activeItem);

      updateElementState(newPosition, {
        fontWeight: activeItem.fontWeight === "bold" ? "normal" : "bold",
      });
    }
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
