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
      activeID,
    } = contextProps;

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
        if (data?.type !== "move") {
          requestAnimationFrame(() => {
            if (data?.type === "resize") {
              if (item?.itemType === "text") {
                currentValues.current.fontSize = initialFontSize * data?.scale;
              }
              currentValues.current.width = initialWidth * data?.scale;
              currentValues.current.height = initialHeight * data?.scale;
            }
            if (data?.type === "rotate") {
              currentValues.current.angle = data?.angle;
            }
            // Force a re-render by updating a minimal piece of state
            // setItemState(prev => ({...prev}));
          });
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
          fontSize: currentValues.current.fontSize,
          dragType: null,
          ...(data?.type === "rotate" &&
            {
              // tlRotate: tlRotation(data?.rotate),
              // trRotate: trRotation(data?.rotate),
              // blRotate: blRotation(data?.rotate),
              // brRotate: brRotation(data?.rotate),
            }),
        }));

        setAllItems((prevItems) => {
          return prevItems.map((s, i) => {
            if (s.id === item.id) {
              return {
                ...s,
                position: data?.position,
                rotate: currentValues.current.angle,
                width: currentValues.current.width,
                height: currentValues.current.height,
                fontSize: currentValues.current.fontSize,
              };
            }
            return s;
          });
        });
      },
    });

    useEffect(() => {
      if (item?.rotate !== undefined) {
        currentValues.current.angle = item.rotate;
        setItemState((prev) => ({ ...prev, rotate: item.rotate }));
      }
    }, [item?.rotate]);

    useEffect(() => {
      if (item?.width !== undefined) {
        currentValues.current.width = item.width;
        setItemState((prev) => ({ ...prev, width: item.width }));
      }
    }, [item?.width]);

    useEffect(() => {
      if (item?.height !== undefined) {
        currentValues.current.height = item.height;
        setItemState((prev) => ({ ...prev, height: item.height }));
      }
    }, [item?.height]);

    useEffect(() => {
      if (item?.fontSize !== undefined) {
        currentValues.current.fontSize = item.fontSize;
        setItemState((prev) => ({ ...prev, fontSize: item.fontSize }));
      }
    }, [item?.fontSize]);

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
        position={position}
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
