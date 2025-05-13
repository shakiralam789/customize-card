import { useCallback, useEffect, useRef, useState } from "react";

export default function useDraggable({
  onDragStart = () => {},
  onDragging = () => {},
  onDragEnd = () => {},
  initialPosition,
  setShowCenterLine,
  setHorizontalCentralLine,
  parentRef,
  zoomLevel,
  rotate,
  item,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const [startElementPos, setStartElementPos] = useState({ x: 0, y: 0 });
  const [type, setType] = useState(null);
  const [dir, setDir] = useState(null);
  const positionRef = useRef(initialPosition);
  const draggingRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  const hasMovedRef = useRef(false);
  const angleRef = useRef(rotate || 0);
  const initialWidth = useRef(null);
  const initialHeight = useRef(null);
  const initialFontSize = useRef(null);

  const startDrag = useCallback(
    ({ e, type, dir }) => {
      e.preventDefault();
      e.stopPropagation();

      const element = e.currentTarget.closest("[data-draggable]");
      if (!element) return;

      draggingRef.current = element;

      initialFontSize.current = element.offsetHeight;
      initialWidth.current = element.offsetWidth;
      initialHeight.current = element.offsetHeight;

      setType(type || null);
      setDir(dir || null);
      setIsClicked(true);
      setStartMousePos({ x: e.clientX, y: e.clientY });

      setStartElementPos(initialPosition);
      positionRef.current = initialPosition;

      onDragStart?.({ e, position: initialPosition, type, element });
    },
    [onDragStart]
  );

  const handleMouseMove = (e) => {
    if (!isClicked || !draggingRef.current) return;

    setIsDragging(true);

    const element = draggingRef.current;
    const rect = element.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    let newPos = { ...positionRef.current };
    let newScale = 1;
    let newAngle = 0;

    if (type === "move") {
      const dx = (e.clientX - startMousePos.x) / zoomLevel;
      const dy = (e.clientY - startMousePos.y) / zoomLevel;

      newPos = {
        x: startElementPos.x + dx,
        y: startElementPos.y + dy,
      };
    }

    if (type === "resize") {
      if (!width) return;

      const dy = (e.clientY - startMousePos.y) / zoomLevel;

      let scaleDelta;

      if (["br", "bl"].includes(dir)) {
        scaleDelta = 1 + dy / initialHeight.current;
      } else if (["tl", "tr"].includes(dir)) {
        scaleDelta = 1 - dy / initialHeight.current;
        const scaledHeight = initialHeight.current * scaleDelta;
        const deltaHeight = scaledHeight - initialHeight.current;
        newPos.y = startElementPos.y - deltaHeight;
      }

      let scaledWidth = initialWidth.current * scaleDelta;
      let deltaWidth = scaledWidth - initialWidth.current;

      if (
        item?.itemType !== "text" ||
        (item?.itemType == "text" && item?.textAlign != "center")
      ) {
        if (dir === "tl" || dir === "bl") {
          newPos.x = startElementPos.x - deltaWidth; // ok for shape
        } else if (dir === "tr" || dir === "br") {
          newPos.x = startElementPos.x;
        }
      } else {
        newPos.x = startElementPos.x - deltaWidth / 2;
      }

      newScale = Math.max(0.5, scaleDelta);
    }

    if (type === "rotate") {
      const centerX = rect.left + width / 2;
      const centerY = rect.top + height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      newAngle =
        Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
      angleRef.current = newAngle;
    }

    const parentRect = parentRef.getBoundingClientRect();
    const dragCenter = rect.left + width / 2;

    const dragLeft = rect.left;
    const dragRight = rect.left + width;

    const dragTop = rect.top;
    const dragBottom = rect.top + height;

    const parentCenter = parentRect.left + parentRect.width / 2;
    const threshold = 2;

    setShowCenterLine((prev) => {
      const shouldShow =
        Math.abs(dragCenter - parentCenter) < threshold ||
        Math.abs(dragLeft - parentCenter) < threshold ||
        Math.abs(dragRight - parentCenter) < threshold;
      return prev !== shouldShow ? shouldShow : prev;
    });

    const dragTopCenter = rect.top + height / 2;
    const parentTopCenter = parentRect.top + parentRect.height / 2;

    setHorizontalCentralLine((prev) => {
      const shouldShow =
        Math.abs(dragTopCenter - parentTopCenter) < threshold ||
        Math.abs(dragBottom - parentTopCenter) < threshold ||
        Math.abs(dragTop - parentTopCenter) < threshold;
      return prev !== shouldShow ? shouldShow : prev;
    });

    hasMovedRef.current = true;

    if (newScale <= 0.5 && type === "resize") return;

    positionRef.current = newPos;
    setPosition(newPos);

    onDragging?.({
      e,
      scale: newScale,
      position: newPos,
      angle: newAngle,
      type,
    });
  };

  const stopDrag = () => {
    setIsDragging(false);
    setType(null);
    setShowCenterLine(false);
    setHorizontalCentralLine(false);
    draggingRef.current = null;
    setIsClicked(false);

    onDragEnd?.({
      hasMoved: hasMovedRef.current,
      type,
      position: positionRef.current,
      rotate: angleRef.current,
    });

    hasMovedRef.current = false;
  };

  useEffect(() => {
    if (isClicked) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isClicked]);

  return {
    position,
    isDragging,
    startDrag,
  };
}
