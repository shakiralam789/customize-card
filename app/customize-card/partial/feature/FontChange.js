import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext } from "react";

export default function FontChange() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  function changeFontSize(value) {
    if (!activeID) return;
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID ? { ...item, fontSize: value } : item
      )
    );
  }

  function increaseFontSize() {
    if (!activeID) return;
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? { ...item, fontSize: (item.fontSize || 0) + 1 }
          : item
      )
    );
  }

  function decreaseFontSize() {
    if (!activeID) return;
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? { ...item, fontSize: (item.fontSize || 0) - 1 }
          : item
      )
    );
  }

  return (
    <div className="flex items-center border border-gray-200 divide-gray-200 rounded divide-x">
      <button
        onClick={decreaseFontSize}
        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 13H5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="px-3 py-1 flex items-center">
        <input
          onChange={(e) => changeFontSize(e.target.value)}
          value={activeItem?.fontSize || 16}
          className="w-4 outline-none text-sm"
        />
      </div>
      <button
        onClick={increaseFontSize}
        className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
