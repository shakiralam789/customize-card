import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { CaseUpper } from "lucide-react";
import React, { useContext } from "react";

export default function TextTransform() {
  const {
    allItems,
    itemsRefs,
    activeID,
    mainRefs,
    updateElementState,
    updateElementDimensions,
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function changeTextTransform(value) {
    if (activeID === null) return;

    if (mainRefs.current[activeID]) {
      itemsRefs.current[activeID].style.textTransform =
        activeItem.textTransform === "none" ? value : "none";
      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      let newPosition = updateElementDimensions(activeItem);
      updateElementState(newPosition, {
        textTransform: activeItem.textTransform === "none" ? value : "none",
      });
    }
  }

  return (
    <IconBtn
      onClick={() => changeTextTransform("uppercase")}
      className={`${
        activeItem?.textTransform === "uppercase" ? "active" : ""
      } `}
    >
      <CaseUpper />
    </IconBtn>
  );
}
