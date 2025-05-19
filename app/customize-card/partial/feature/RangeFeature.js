import IconBtn from "@/components/IconBtn";
import MenuItemCom from "@/components/MenuListCom";
import CcContext from "@/context/ccContext";
import { isTextOneLine, limitDecimalPlaces } from "@/helper/helper";
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
  onDragEnd = () => {},
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
  const menuRef = useRef();

  const [initialValue, setInitialValue] = useState(getCurrent());
  const positionRef = useRef(activeItem?.position || {});
  const rangeRef = useRef(null);
  const inputRef = useRef(null);

  const percentage = ((initialValue - min) / (max - min)) * 100;

  function handleChange(value) {
    if (!activeID || !value) return;

    const newValue = limitDecimalPlaces(parseFloat(value));
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
        if (propertyName !== "textCurve") {
          itemsRefs.current[activeID].style[
            propertyName
          ] = `${newValue}${unit}`;
        }
      }

      if (propertyName != "rotate" && propertyName != "textCurve") {
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
    const limitedValue = limitDecimalPlaces(parseFloat(value));
    if (propertyName != "textCurve") {
      setAllItems((prevItems) =>
        prevItems.map((item) =>
          item.id === activeID
            ? {
                ...item,
                [propertyName]: limitedValue,
                width: positionRef.current?.width || activeItem?.width,
                height: positionRef.current.height || activeItem?.height,
                position: {
                  x: positionRef.current?.left || activeItem?.position?.x,
                  y: activeItem?.position?.y,
                },
              }
            : item
        )
      );
    }

    if (onDragEnd) {
      onDragEnd({ value: limitedValue, activeItem });
    }
  }

  function handleInputKeyDown(e) {
    let newValue = parseFloat(initialValue);

    const allowedKeys = ["ArrowUp", "ArrowDown", "Tab"];

    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      newValue = Math.min(max, newValue + parseFloat(step));
      newValue = limitDecimalPlaces(newValue);
      handleChange(newValue);
      handleDragEnd(newValue);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      newValue = Math.max(min, newValue - parseFloat(step));
      newValue = limitDecimalPlaces(newValue);
      handleChange(newValue);
      handleDragEnd(newValue);
    }
  }

  useEffect(() => {
    if (activeItem?.[propertyName] != null) {
      const value = limitDecimalPlaces(activeItem[propertyName]);
      setInitialValue(value);
    }
  }, [activeID, activeItem?.[propertyName]]);

  function getCurrent() {
    if (activeID === null || !propertyName) return defValue;
    const value = activeItem?.[propertyName] ?? defValue;
    return limitDecimalPlaces(value);
  }

  return (
    <div className="relative">
      <Menu
        ref={menuRef}
        menuClassName={`${
          propertyName === "textCurve" &&
          !isTextOneLine(activeItem?.text || "")?.isOneLine
            ? "hidden"
            : ""
        } w-56 bg-very-light-gray rounded-md border border-gray-200 px-2 pt-2`}
        align="center"
        gap={6}
        menuButton={({ open }) => (
          <IconBtn
            disabled={
              propertyName === "textCurve" &&
              (activeItem?.contentEditable ||
                !isTextOneLine(activeItem?.text || "")?.isOneLine)
                ? true
                : false
            }
            className={`${
              open && isTextOneLine(activeItem?.text || "")?.isOneLine
                ? "active"
                : ""
            }`}
          >
            {children}
          </IconBtn>
        )}
        className={"ml-3"}
      >
        <MenuItemCom
          onClick={(e) => {
            e.keepOpen = true;
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-gray-700">
              {title}
            </span>
            <div className="flex items-center">
              <div className="flex items-center">
                <button
                  className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-l focus:outline-none hover:bg-gray-100"
                  onClick={() => {
                    const newValue = Math.max(
                      min,
                      parseFloat(initialValue) - parseFloat(step)
                    );
                    const limitedValue = limitDecimalPlaces(newValue);
                    handleChange(limitedValue);
                    handleDragEnd(limitedValue);
                  }}
                >
                  <span className="text-xs">−</span>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  readOnly
                  value={initialValue}
                  onKeyDown={handleInputKeyDown}
                  className="w-10 h-6 text-[11px] text-center border-t border-b border-gray-300 focus:outline-none"
                />
                <button
                  className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-r focus:outline-none hover:bg-gray-100"
                  onClick={() => {
                    const newValue = Math.min(
                      max,
                      parseFloat(initialValue) + parseFloat(step)
                    );
                    const limitedValue = limitDecimalPlaces(newValue);
                    handleChange(limitedValue);
                    handleDragEnd(limitedValue);
                  }}
                >
                  <span className="text-xs">+</span>
                </button>
              </div>
              <span className="text-xs ml-1">{unit}</span>
            </div>
          </div>

          <div className="relative h-6 mx-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transform -translate-y-1/2"
              style={{ width: `${percentage}%` }}
            ></div>

            <div
              className="absolute w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-md transform -translate-y-1/2"
              style={{
                left: `${percentage}%`,
                top: "50%",
                marginLeft: "-8px",
              }}
            ></div>

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
              className="w-full h-6 absolute top-0 left-0 opacity-0 cursor-pointer z-10"
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
