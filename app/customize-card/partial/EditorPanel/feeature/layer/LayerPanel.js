import React, { useContext, useEffect, useRef, useState } from "react";
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
  Check,
  Eye,
  EyeClosed,
  GripVertical,
  LockIcon,
  LockOpen,
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
  const [selected, setSelected] = useState(false);
  const inputRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 0,
  };

  useEffect(() => {
    if (selected && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [selected]);

  function handleCheck() {
    setAllItems((prev) =>
      prev.map((x) =>
        x.id == item.id
          ? {
              ...x,
              active: true,
            }
          : { ...x, active: false }
      )
    );
    setActiveID(item?.id);
  }

  function lockHandler(value) {
    setAllItems((prev) =>
      prev.map((x) =>
        x.id == item.id
          ? {
              ...x,
              locked: value != "lock",
            }
          : x
      )
    );
  }

  function eyeHandler(value) {
    setAllItems((prev) =>
      prev.map((x) =>
        x.id == item.id
          ? {
              ...x,
              active: x.id == activeID ? false : x.active,
              hidden: value == "open",
            }
          : x
      )
    );

    if (item?.id == activeID) {
      setActiveID(null);
    }
  }
  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={style}
      className={`flex gap-2 items-center mb-2`}
    >
      <div
        onClick={handleCheck}
        className={`${
          item?.id === activeID ? "active" : ""
        } cursor-pointer flex-1 flex items-center gap-2 text-gray-600 bg-white text-xs [&.active]:border-gray-300 [&.active]:bg-emerald-50 hover:bg-emerald-50 border border-gray-200 rounded-md p-2 pl-1`}
      >
        <GripVertical
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab size-4 active:cursor-grabbing"
        />
        {selected ? (
          <input
            ref={inputRef}
            onBlur={() => {
              setSelected(false);
            }}
            onChange={(e) => {
              setAllItems((prev) =>
                prev.map((x) =>
                  x.id == item.id
                    ? {
                        ...x,
                        name: e.target.value,
                      }
                    : x
                )
              );
            }}
            value={item?.name || ""}
            className="bg-gray-200 w-full outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => {
              setSelected(true);
            }}
            className="w-full min-h-4 whitespace-nowrap overflow-hidden overflow-ellipsis"
          >
            {item?.name}
          </span>
        )}
      </div>
      <div className="text-gray-500 flex items-center space-x-1 *:size-4 cursor-pointer">
        {item?.locked ? (
          <LockIcon className="!size-3.5" onClick={() => lockHandler("lock")} />
        ) : (
          <LockOpen
            className="!size-3.5"
            onClick={() => lockHandler("unlock")}
          />
        )}
        {item?.hidden ? (
          <EyeClosed onClick={() => eyeHandler("close")} />
        ) : (
          <Eye onClick={() => eyeHandler("open")} />
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
