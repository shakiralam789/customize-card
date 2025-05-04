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

  return (
    <motion.div ref={setNodeRef} layout style={style} className={`relative`}>
      <div
        className={`${
          item?.id === activeID ? "active" : ""
        } pr-16 flex items-center gap-2 text-gray-600 bg-white text-xs [&.active]:border-gray-300 [&.active]:bg-emerald-50 hover:bg-emerald-50 border border-gray-200 rounded-md p-2 pl-1 mb-2`}
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
        <div
          onClick={() => {
            if (item?.id == activeID) {
              setActiveID(null);
              setAllItems((prev) =>
                prev.map((x) =>
                  x.id == item.id
                    ? {
                        ...x,
                        active: false,
                      }
                    : x
                )
              );
            } else {
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
          }}
          className={`${
            item?.id === activeID ? "active" : ""
          } [&.active]:bg-emerald-400 [&.active]:text-white [&.active]:border-emerald-400 size-4 flex items-center justify-center border bg-gray-100 border-gray-300 rounded`}
        >
          {item?.id === activeID ? <Check className="size-4" /> : null}
        </div>
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
