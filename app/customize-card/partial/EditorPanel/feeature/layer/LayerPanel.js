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

export default function LayerPanel({ show, onClose }) {
  return (
    <PanelDrawer title={"Layer"} show={show} onClose={onClose}>
      <DraggableList />
    </PanelDrawer>
  );
}
const SortableItem = ({ item, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 0,
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      layout
      style={style}
      className="bg-gray-200 rounded p-2 mb-2 cursor-grab active:cursor-grabbing"
    >
      {item?.name || index}
    </motion.div>
  );
};

function DraggableList() {
  const { allItems, setAllItems } = useContext(CcContext);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAllItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);

        // Defensive check
        if (oldIndex === -1 || newIndex === -1) return prev;

        const newOrder = arrayMove([...prev], oldIndex, newIndex);

        // console.log(newOrder);
        
        return newOrder;
      });
    }
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
          {allItems.map((item, index) => (
            <SortableItem key={item?.id} item={item} index={index} />
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
