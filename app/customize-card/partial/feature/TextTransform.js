import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { CaseUpper } from "lucide-react";
import React, { useContext } from "react";

export default function TextTransform() {
  const {
    allItems,
    setAllItems,
    activeID,
    mainRefs,
    updateElementState,
    updateElementDimensions,
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  function changeTextTransform(value) {
    if (activeID === null) return;

    setAllItems((prev) =>
      prev.map((item) =>
        item.id === activeID
          ? {
              ...item,
              textTransform: item.textTransform === "none" ? value : "none",
            }
          : item
      )
    );

    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      requestAnimationFrame(() => {
        let newPosition = updateElementDimensions();
        updateElementState(newPosition, activeItem?.fontSize);
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
