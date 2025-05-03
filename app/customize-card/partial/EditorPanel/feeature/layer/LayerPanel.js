import React, { useContext, useState } from "react";
import PanelDrawer from "../../PanelDrawer";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import CcContext from "@/context/ccContext";
import {
  DotIcon,
  Eye,
  EyeClosed,
  EyeIcon,
  GripVertical,
  LockIcon,
  LockOpen,
  MenuIcon,
} from "lucide-react";

export default function LayerPanel({ show, onClose }) {
  return (
    <PanelDrawer title={"Layer"} show={show} onClose={onClose}>
      <DraggableList />
    </PanelDrawer>
  );
}
const SortableItem = ({ item, index, activeID }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item?.id });
  const { setAllItems, setActiveID } = useContext(CcContext);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 0,
  };

  return (
    <motion.div ref={setNodeRef} layout style={style} className={`relative`}>
      <div
        {...attributes}
        {...listeners}
        className={`${
          item?.id === activeID ? "active" : ""
        } flex items-center gap-2 text-gray-600 bg-white text-xs [&.active]:border-gray-300 [&.active]:bg-emerald-50 hover:bg-emerald-50 border border-gray-200 rounded-md p-2 pl-1 mb-2 cursor-grab active:cursor-grabbing`}
      >
        <GripVertical className="size-5" />
        {item?.name || index}
      </div>
      <div className="text-gray-500 absolute top-1/2 -translate-y-1/2 right-2 flex items-center space-x-1 *:size-4 cursor-pointer">
        {item?.hidden ? (
          <EyeClosed
            onClick={() => {
              setAllItems((prev) =>
                prev.map((x) =>
                  x.id == item.id
                    ? {
                        ...x,
                        active: x.id == activeID ? false : x.active,
                        hidden: false,
                      }
                    : x
                )
              );
              if (item?.id == activeID) {
                setActiveID(null);
              }
            }}
          />
        ) : (
          <Eye
            onClick={() => {
              setAllItems((prev) =>
                prev.map((x) =>
                  x.id == item.id
                    ? {
                        ...x,
                        active: x.id == activeID ? false : x.active,
                        hidden: true,
                      }
                    : x
                )
              );

              if (item?.id == activeID) {
                setActiveID(null);
              }
            }}
          />
        )}
        {item?.locked ? (
          <LockIcon
            className="!size-3.5"
            onClick={() => {
              setAllItems((prev) =>
                prev.map((x) =>
                  x.id == item.id
                    ? {
                        ...x,
                        active: x.id == activeID ? false : x.active,
                        locked: false,
                      }
                    : x
                )
              );
              if (item?.id == activeID) {
                setActiveID(null);
              }
            }}
          />
        ) : (
          <LockOpen
            className="!size-3.5"
            onClick={() => {
              setAllItems((prev) =>
                prev.map((x) =>
                  x.id == item.id
                    ? {
                        ...x,
                        active: x.id == activeID ? false : x.active,
                        locked: true,
                      }
                    : x
                )
              );
              if (item?.id == activeID) {
                setActiveID(null);
              }
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

function DraggableList() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setAllItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
        return prev;

      const newOrder = arrayMove([...prev], oldIndex, newIndex).map(
        (item, i) => ({
          ...item,
          zIndex: 10 + i,
        })
      );

      return newOrder;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div layout>
          {[...allItems].reverse().map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              activeID={activeID}
            />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
