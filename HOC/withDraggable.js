import {
  tlRotation,
  trRotation,
  blRotation,
  brRotation,
} from "@/helper/helper";
import useDraggable from "@/hook/useDraggable";
import React, { useEffect, useRef, useState } from "react";

export default function withDraggable(Component) {
  return function WithComponent({ contextProps, item, ...rest }) {
    const {
      shouldBeSelected,
      parentRef,
      setShowCenterLine,
      setHorizontalCentralLine,
      setAllItems,
      zoomLevel,
      setIsAnyItemDragging,
      mainRefs,
      handlerRefs,
    } = contextProps;

    const hasMounted = useRef(true);
    const [angle, setAngle] = useState(item?.rotate || 0);
    const [itemState, setItemState] = useState({
      rotate: item?.rotate || 0,
      width: item?.width || null,
      height: item?.height || null,
      fontSize: item?.fontSize || null,
      tlRotate: "tl",
      trRotate: "tr",
      blRotate: "bl",
      brRotate: "br",
      dragType: null,
    });

    const currentValues = useRef({
      angle: item?.rotate || 0,
      width: item?.width || null,
      height: item?.height || null,
      fontSize: item?.fontSize || null,
      top: item?.position?.y,
      left: item?.position?.x,
      textCurve: item?.textCurve || null,
    });

    const initialFontSize = item?.itemType === "text" ? item.fontSize : null;
    const initialWidth = item.width || null;
    const initialHeight = item?.height || null;
    const initialTextCurve = item?.textCurve || null;

    const { isDragging, startDrag, dir } = useDraggable({
      zoomLevel,
      setHorizontalCentralLine,
      setShowCenterLine,
      initialPosition: item?.position,
      parentRef: parentRef?.current,
      rotate: item?.rotate,
      item,

      onDragStart: (data) => {
        shouldBeSelected.current = true;
        setItemState((prev) => ({ ...prev, dragType: data?.type }));
      },

      onDragging: (data) => {
        setIsAnyItemDragging(true);
        let follower = mainRefs.current[item.id];
        let handler = handlerRefs.current[item.id];

        if (data?.type !== "move") {
          if (data?.type === "resize") {
            const newWidth = initialWidth * data?.scale;
            const newHeight = initialHeight * data?.scale;
            const newFontSize =
              item?.itemType === "text" ? initialFontSize * data?.scale : null;

            if (initialTextCurve !== null) {
              currentValues.current.textCurve = initialTextCurve / data?.scale;
            }
            currentValues.current.width = newWidth;
            currentValues.current.height = newHeight;
            currentValues.current.fontSize = newFontSize;

            requestAnimationFrame(() => {
              if (!follower && !handler) return;

              [follower, handler].forEach((el) => {
                if (!el) return;

                if (item?.itemType === "text" && newFontSize) {
                  el.style.fontSize = `${newFontSize}px`;
                }

                el.style.width = `${newWidth}px`;
                el.style.height = `${newHeight}px`;
                el.style.left = `${data.position.x}px`;
                el.style.top = `${data.position.y}px`;
              });
            });
          } else if (data?.type === "rotate") {
            currentValues.current.angle = data?.angle;
            const transform = `rotate(${data?.angle}deg)`;
            setAngle(data?.angle);
            requestAnimationFrame(() => {
              if (follower)
                follower.style.transform = `rotate(${data?.angle}deg) scaleX(${
                  item?.scaleX || 1
                }) scaleY(${item?.scaleY || 1})`;
              if (handler) handler.style.transform = transform;
            });
          }
        } else {
          requestAnimationFrame(() => {
            if (follower) {
              follower.style.left = `${data.position.x}px`;
              follower.style.top = `${data.position.y}px`;
            }
            if (handler) {
              handler.style.left = `${data.position.x}px`;
              handler.style.top = `${data.position.y}px`;
            }
          });
        }
      },

      onDragEnd: (data) => {
        shouldBeSelected.current = !data?.hasMoved;
        setIsAnyItemDragging(false);
        if (!data.hasMoved) return;
        let updatedItem = {
          ...item,
          rotate: currentValues.current.angle,
          width: currentValues.current.width,
          height: currentValues.current.height,
          fontSize: currentValues.current.fontSize,
          position: data.position,
        };

        if (currentValues.current.textCurve) {
          updatedItem = {
            ...updatedItem,
            textCurve: currentValues.current.textCurve,
          };
        }

        setItemState((prev) => ({
          ...prev,
          rotate: currentValues.current.angle,
          width: currentValues.current.width,
          height: currentValues.current.height,
          fontSize: currentValues.current.fontSize,
          dragType: null,
        }));

        setAllItems((prevItems) =>
          prevItems.map((s) => (s.id === item.id ? updatedItem : s))
        );

        const follower = mainRefs.current[item.id];
        const handler = handlerRefs.current[item.id];

        if (follower || handler) {
          requestAnimationFrame(() => {
            [follower, handler].forEach((el, i) => {
              if (!el) return;

              if (item?.itemType === "text" && updatedItem.fontSize) {
                el.style.fontSize = `${updatedItem.fontSize}px`;
              }

              el.style.width = `${updatedItem.width}px`;
              el.style.height = `${updatedItem.height}px`;
              el.style.left = `${updatedItem.position.x}px`;
              el.style.top = `${updatedItem.position.y}px`;
            });

            follower.style.transform = `rotate(${
              updatedItem.rotate
            }deg) scaleX(${item?.scaleX || 1}) scaleY(${item?.scaleY || 1})`;

            handler.style.transform = `rotate(${updatedItem.rotate}deg)`;
          });
        }
      },
    });

    useEffect(() => {
      if (item?.rotate !== undefined) {
        currentValues.current.angle = item.rotate;
        setItemState((prev) => ({ ...prev, rotate: item.rotate }));
      }
      if (item?.width !== undefined) {
        currentValues.current.width = item.width;
        setItemState((prev) => ({ ...prev, width: item.width }));
      }
      if (item?.height !== undefined) {
        currentValues.current.height = item.height;
        setItemState((prev) => ({ ...prev, height: item.height }));
      }
      if (item?.fontSize !== undefined) {
        currentValues.current.fontSize = item.fontSize;
        setItemState((prev) => ({ ...prev, fontSize: item.fontSize }));

        if (hasMounted.current) {
          hasMounted.current = false;
          return;
        }
      }
    }, [
      item?.rotate,
      item?.width,
      item?.height,
      item?.fontSize,
      // item?.position?.x,
      // item?.position?.y,
    ]);

    const { dragType, tlRotate, trRotate, blRotate, brRotate } = itemState;

    return (
      <Component
        isDragging={isDragging}
        dragType={dragType}
        startDrag={startDrag}
        tlRotate={tlRotate}
        trRotate={trRotate}
        blRotate={blRotate}
        brRotate={brRotate}
        currentValues={currentValues}
        item={item}
        contextProps={contextProps}
        dir={dir}
        angle={angle}
        {...rest}
      />
    );
  };
}
