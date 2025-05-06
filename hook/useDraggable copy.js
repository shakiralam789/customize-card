import { useCallback, useEffect, useRef, useState } from "react";

export default function useDraggable({
  onDragStart = () => {},
  onDragging = () => {},
  onDragEnd = () => {},
  initialPosition,
  setShowCenterLine,
  parentRef,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const [startElementPos, setStartElementPos] = useState({ x: 0, y: 0 });
  const [type, setType] = useState(null);
  const [dir, setDir] = useState(null);
  const positionRef = useRef(initialPosition);
  const draggingRef = useRef(null);

  const startDrag = useCallback(
    ({ e, type, dir }) => {
      e.preventDefault();
      e.stopPropagation();

      let element = e.currentTarget;
      const boxEl = element.closest("[data-draggable]");
      if (!boxEl) return;

      const id = boxEl.dataset.id;
      if (!id) return;

      draggingRef.current = boxEl;

      if (type) {
        setType(type);
      }

      if (dir) {
        setDir(dir);
      }

      setIsDragging(true);
      setStartMousePos({ x: e.clientX, y: e.clientY });
      setStartElementPos(position);

      if (onDragStart) {
        onDragStart({ e, position, type, element });
      }
    },
    [position, onDragStart]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const element = draggingRef.current;

      if (!element) return;

      let rect;
      let width;
      let height;
      let newScale = 0;
      let newPos = { ...position };
      let newAngle = 0;

      rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (type === "move") {
        const dx = e.clientX - startMousePos.x;
        const dy = e.clientY - startMousePos.y;
        newPos = {
          x: startElementPos.x + dx,
          y: startElementPos.y + dy,
        };
      }

      if (type === "resize") {
        if (!width) return;

        const dy = e.clientY - startMousePos.y;

        if (dir === "br") {
          newScale = Math.max(0.5, 1 + dy / width);
          newPos.x = startElementPos.x - dy / 2;
        } else if (dir === "bl") {
          newScale = Math.max(0.5, 1 + dy / width);
          newPos.x = startElementPos.x - dy / 2;
        } else if (dir === "tl") {
          newScale = Math.max(0.5, 1 - dy / width);
          const scaleChange = newScale - 1;

          const pixelChange = scaleChange * height;

          newPos.y = startElementPos.y - pixelChange / 2;
          newPos.x = startElementPos.x + dy / 2;
        } else if (dir === "tr") {
          newScale = Math.max(0.5, 1 - dy / width);
          const scaleChange = newScale - 1;

          const pixelChange = scaleChange * height;

          newPos.y = startElementPos.y - pixelChange / 2;
          newPos.x = startElementPos.x + dy / 2;
        }
      }

      if (type == "rotate") {
        const box = element;

        if (box) {
          const rect = box.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;

          newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

          newAngle = Math.round((newAngle + 360) % 360);
        }
      }

      const parentRect = parentRef.getBoundingClientRect();
      const dragCenter = rect?.left + width / 2;
      const parentCenter = parentRect.left + parentRect.width / 2;

      const threshold = 2;

      setShowCenterLine((prev) => {
        const shouldShow = Math.abs(dragCenter - parentCenter) < threshold;
        return shouldShow !== prev ? shouldShow : prev;
      });

      setPosition(newPos);

      positionRef.current = newPos;

      if (onDragging) {
        onDragging({
          e,
          scale: newScale,
          position: newPos,
          angle: newAngle,
          type,
        });
      }
    },
    [isDragging, startMousePos, startElementPos, type, dir, parentRef, position]
  );

  const stopDrag = useCallback(() => {
    setIsDragging(false);
    setType(null);
    setShowCenterLine(false);
    draggingRef.current = null

    if (onDragEnd) {
      onDragEnd({
        type,
        position: positionRef.current,
      });
    }
  }, [type]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging, startMousePos, startElementPos, handleMouseMove, startDrag]);

  return { position, isDragging, startDrag };
}
