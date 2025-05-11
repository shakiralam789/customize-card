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
      itemsRefs,
      mainRefs,
      activeID,
      handlerRefs,
    } = contextProps;

    const hasMounted = useRef(true);

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
    });

    const initialFontSize = item?.itemType === "text" ? item.fontSize : null;
    const initialWidth = item.width || null;
    const initialHeight = item?.height || null;

    const { position, isDragging, startDrag } = useDraggable({
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
          requestAnimationFrame(() => {
            if (data?.type === "resize") {
              // Handle resize
              if (item?.itemType === "text") {
                currentValues.current.fontSize = initialFontSize * data?.scale;
                follower.style.fontSize = currentValues.current.fontSize + "px";
              }
              currentValues.current.width = initialWidth * data?.scale;
              currentValues.current.height = initialHeight * data?.scale;

              [follower, handler].forEach((el) => {
                if (!el) return;
                el.style.width = `${currentValues.current.width}px`;
                el.style.height = `${currentValues.current.height}px`;
                el.style.left = `${data.position.x}px`;
                el.style.top = `${data.position.y}px`;
              });
            } else if (data?.type === "rotate") {
              currentValues.current.angle = data?.angle;
              const transform = `rotate(${currentValues.current.angle}deg)`;
              follower && (follower.style.transform = transform);
              handler && (handler.style.transform = transform);
            }
          });
        } else {
          follower && (follower.style.left = `${data.position.x}px`);
          follower && (follower.style.top = `${data.position.y}px`);
          handler && (handler.style.left = `${data.position.x}px`);
          handler && (handler.style.top = `${data.position.y}px`);
        }
      },

      onDragEnd: (data) => {
        shouldBeSelected.current = !data?.hasMoved;
        setIsAnyItemDragging(false);

        setItemState((prev) => ({
          ...prev,
          rotate: currentValues.current.angle,
          width: currentValues.current.width,
          height: currentValues.current.height,
          top: currentValues.current.top,
          left: currentValues.current.left,

          fontSize: currentValues.current.fontSize,
          dragType: null,
          // ...(data?.type === "rotate" && {
          //   tlRotate: tlRotation(data?.rotate),
          //   trRotate: trRotation(data?.rotate),
          //   blRotate: blRotation(data?.rotate),
          //   brRotate: brRotation(data?.rotate),
          // }),
        }));

        setAllItems((prevItems) =>
          prevItems.map((s) =>
            s.id === item.id
              ? {
                  ...s,
                  rotate: currentValues.current.angle,
                  width: currentValues.current.width,
                  height: currentValues.current.height,
                  fontSize: currentValues.current.fontSize,
                  position: data.position,
                }
              : s
          )
        );
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
    }, [item?.rotate, item?.width, item?.height, item?.fontSize]);

    useEffect(() => {
      let referItem = itemsRefs.current[activeID];
      if (referItem && item?.contentEditable && item.itemType === "text") {
        const range = document.createRange();
        range.selectNodeContents(referItem);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        item.isPlaceholder = false;
      }
    }, [item.contentEditable, activeID]);

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
        {...rest}
      />
    );
  };
}
