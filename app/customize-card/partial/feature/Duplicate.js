import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { CopyPlus } from "lucide-react";
import React, { useContext, useEffect, useRef } from "react";
import uuid4 from "uuid4";

export default function Duplicate() {
  const { allItems, setAllItems, activeID, setActiveID, itemsRefs } =
    useContext(CcContext);

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
    
    // Generate new ID
    let id = uuid4();
  
    setAllItems((prev) => {
      const activeItem = prev.find(item => item.id === activeID);
      if (!activeItem) return prev;
      
      const baseName = activeItem.name.replace(/ Copy( \d+)?$/, '');
      const copies = prev.filter(item => 
        item.name.startsWith(baseName + ' Copy') || item.name === baseName + ' Copy'
      );
      
      let copyName;
      if (copies.length === 0) {
        copyName = `${baseName} Copy`;
      } else {
        let highestNumber = 0;
        
        copies.forEach(copy => {
          const match = copy.name.match(/ Copy( (\d+))?$/);
          if (match) {
            if (!match[2]) {
              highestNumber = Math.max(highestNumber, 1);
            } else {
              highestNumber = Math.max(highestNumber, parseInt(match[2]));
            }
          }
        });
        
        copyName = `${baseName} Copy ${highestNumber + 1}`;
      }
      
      const item = {
        ...activeItem,
        id,
        active: true,
        name: copyName,
        position: {
          x: activeItem.position.x + 30,
          y: activeItem.position.y + 30,
        },
      };
  
      const updatedItems = prev.map((item) =>
        item.id === activeID
          ? { ...item, contentEditable: false, active: false }
          : { ...item, active: false }
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
