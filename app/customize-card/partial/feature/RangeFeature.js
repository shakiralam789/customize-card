import IconBtn from "@/components/IconBtn";
import MenuItemCom from "@/components/MenuListCom";
import CcContext from "@/context/ccContext";
import useItemsMap from "@/hook/useItemMap";
import { Menu } from "@szhsin/react-menu";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function RangeFeature({
  title = "",
  propertyName,
  children,
  min = 0,
  max = 100,
  step = 1,
  defValue = 0,
  unit = "em",
  onHandleChange = () => {},
}) {
  const {
    updateElementDimensions,
    mainRefs,
    handlerRefs,
    allItems,
    setAllItems,
    activeID,
    itemsRefs,
  } = useContext(CcContext);

  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

  const [initialValue, setInitialValue] = useState(getCurrent());
  const positionRef = useRef(activeItem?.position || {});
  const rangeRef = useRef(null);
  const inputRef = useRef(null);

  // Calculate the percentage for visual styling
  const percentage = ((initialValue - min) / (max - min)) * 100;

  function handleChange(value) {
    if (!activeID || !value) return;

    const newValue = parseFloat(value);
    if (isNaN(newValue)) return;

    setInitialValue(newValue);

    if (mainRefs.current[activeID]) {
      if (propertyName == "rotate") {
        mainRefs.current[
          activeID
        ].style.transform = `rotate(${newValue}deg) scaleX(${
          activeItem?.scaleX || 1
        }) scaleY(${activeItem?.scaleY || 1})`;

        handlerRefs.current[
          activeID
        ].style.transform = `rotate(${newValue}deg)`;
      } else {
        itemsRefs.current[activeID].style[propertyName] = `${newValue}${unit}`;
      }

      if (propertyName != "rotate") {
        mainRefs.current[activeID].style.width = `auto`;
        mainRefs.current[activeID].style.height = `auto`;

        requestAnimationFrame(() => {
          positionRef.current = updateElementDimensions(activeItem);
        });
      }
    }

    if (onHandleChange) {
      onHandleChange({ value: newValue, activeItem });
    }
  }

  function handleDragEnd(value) {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              [propertyName]: parseFloat(value),
              width: positionRef.current?.width || activeItem?.width,
              height: positionRef.current.height || activeItem?.height,
            }
          : item
      )
    );
  }

  function handleInputKeyDown(e) {
    let newValue = parseFloat(initialValue);

    // Only allow numeric input, arrows, backspace, delete, and tab
    const allowedKeys = [
      "ArrowUp",
      "ArrowDown",
      "Backspace",
      "Delete",
      "Tab",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "-",
    ];

    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      newValue = Math.min(max, newValue + parseFloat(step));
      handleChange(newValue);
      handleDragEnd(newValue);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      newValue = Math.max(min, newValue - parseFloat(step));
      handleChange(newValue);
      handleDragEnd(newValue);
    }
  }

  useEffect(() => {
    if (activeItem?.[propertyName] != null) {
      const value = activeItem[propertyName];
      setInitialValue(value);
    }
  }, [activeID, activeItem?.[propertyName]]);

  function getCurrent() {
    if (activeID === null || !propertyName) return defValue;
    return activeItem?.[propertyName] ?? defValue;
  }

  return (
    <div className="relative">
      <Menu
        menuClassName={
          "w-56 bg-very-light-gray rounded-md border border-gray-200 px-3 pt-2"
        }
        align="center"
        gap={6}
        menuButton={({ open }) => (
          <IconBtn className={`${open ? "active" : ""}`}>{children}</IconBtn>
        )}
        className={"ml-3"}
      >
        <MenuItemCom
          onClick={(e) => {
            e.keepOpen = true;
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-700">{title}</span>
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="number"
                min={min}
                max={max}
                step={step}
                value={initialValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (parseFloat(value) >= min && parseFloat(value) <= max)
                  ) {
                    handleChange(value || min);
                  }
                }}
                onBlur={(e) => {
                  const value =
                    e.target.value === "" ? min : parseFloat(e.target.value);
                  handleChange(value);
                  handleDragEnd(value);
                }}
                onKeyDown={handleInputKeyDown}
                className="w-14 h-6 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-xs ml-1">{unit}</span>
            </div>
          </div>

          <div className="relative h-8 px-2">
            {/* Track background */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

            {/* Filled track */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transform -translate-y-1/2"
              style={{ width: `${percentage}%` }}
            ></div>

            {/* Custom thumb */}
            <div
              className="absolute w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md transform -translate-y-1/2"
              style={{
                left: `${percentage}%`,
                top: "50%",
                marginLeft: "-8px",
              }}
            ></div>

            {/* Actual range input - separated from other elements */}
            <input
              ref={rangeRef}
              type="range"
              min={min}
              max={max}
              step={step}
              value={initialValue}
              onChange={(e) => handleChange(e.target.value)}
              onMouseUp={(e) => handleDragEnd(e.target.value)}
              onTouchEnd={(e) => handleDragEnd(e.target.value)}
              className="w-full h-8 absolute top-0 left-0 opacity-0 cursor-pointer z-10"
            />
          </div>

          <div className="flex justify-between mt-1 mb-2">
            <span className="text-xs text-gray-500">{min}</span>
            <span className="text-xs text-gray-500">{max}</span>
          </div>
        </MenuItemCom>
      </Menu>
    </div>
  );
}
