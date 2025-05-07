import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { CopyPlus } from "lucide-react";
import React, { useContext, useEffect, useRef } from "react";
import uuid4 from "uuid4";

export default function Duplicate() {
  const { allItems, setAllItems, activeID, setActiveID, itemsRefs } =
    useContext(CcContext);

  // Keep track of pending text updates
  const pendingTextUpdate = useRef(null);

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  useEffect(() => {
    if (pendingTextUpdate.current) {
      const { id, text } = pendingTextUpdate.current;
      const element = itemsRefs.current[id];

      if (element) {
        element.innerHTML = text;
        pendingTextUpdate.current = null;
      }
    }
  });

  function handleDuplicate() {
    if (activeID === null) return;
    let id = uuid4();

    setAllItems((prev) => {
      const item = {
        ...activeItem,
        id,
        active: true,
        name: `${activeItem.name} Copy`,
        position: {
          x: activeItem.position.x + 30,
          y: activeItem.position.y + 30,
        },
      };

      const updatedItems = prev.map((item) =>
        item.id === activeID
          ? { ...item, contentEditable: false, active: false }
          : item
      );

      if (activeItem.itemType === "text") {
        pendingTextUpdate.current = {
          id,
          text: activeItem.text,
        };
      }

      setActiveID(id);
      return [...updatedItems, item];
    });
  }

  return (
    <IconBtn onMouseDown={handleDuplicate}>
      <CopyPlus />
    </IconBtn>
  );
}
