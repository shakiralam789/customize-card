import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext } from "react";

export default function ColorChange() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const handleColorChange = (e) => {
    if (activeID === null) return;
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID ? { ...item, color: e.target.value } : item
      )
    );
  };
  return (
    <div className="size-7 flex items-center justify-center border border-gray-200 divide-gray-200">
      <input
        onChange={handleColorChange}
        value={activeID !== null ? activeItem?.color || "#ffffff" : "#ffffff"}
        type="color"
        className="cursor-pointer size-5"
      ></input>
    </div>
  );
}
