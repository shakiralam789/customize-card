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
import { Eye, EyeClosed, EyeIcon, LockIcon, LockOpen } from "lucide-react";

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

  const [eyeOpen, setEyeOpen] = useState(true);
  const [lockOpen, setLockOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 0,
  };

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={style}
      className={`relative`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`${item?.id === activeID ? "active" : ""} text-gray-600 bg-white text-xs [&.active]:border-gray-300 [&.active]:bg-emerald-50 hover:bg-emerald-50 border border-gray-200 rounded-md p-2 mb-2 cursor-grab active:cursor-grabbing`}
      >
        {item?.name || index}
      </div>
      <div className="text-gray-500 absolute top-1/2 -translate-y-1/2 right-2 flex items-center space-x-1 *:size-4 cursor-pointer">
        {eyeOpen ? (
          <Eye onClick={() => setEyeOpen(false)} />
        ) : (
          <EyeClosed onClick={() => setEyeOpen(true)} />
        )}
        {lockOpen ? (
          <LockIcon className="!size-3.5" onClick={() => setLockOpen(false)} />
        ) : (
          <LockOpen className="!size-3.5" onClick={() => setLockOpen(true)} />
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
