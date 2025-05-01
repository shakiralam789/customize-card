import { useEffect, useState } from "react";

export default function useDraggable({
  initialValue,
  onDragStart = () => {},
  onDragging = () => {},
  onDragEnd = () => {},
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialValue?.position);
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const [startElementPos, setStartElementPos] = useState({ x: 0, y: 0 });
  const [type, setType] = useState(null);
  const [dir, setDir] = useState(null);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [angle, setAngle] = useState(0);

  const startDrag = ({ e, type, dir }) => {
    e.preventDefault();
    e.stopPropagation();
    let rect;
    if (type) {
      setType(type);
    }

    const box = initialValue?.element;

    if (box) {
      rect = box.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    }

    if (dir) {
      setDir(dir);
    }
    setIsDragging(true);
    setStartMousePos({ x: e.clientX, y: e.clientY });
    setStartElementPos(position);

    if (onDragStart) {
      onDragStart({ e, scale, position, type });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    let newScale = scale;
    let newPos = { ...position };
    let newAngle = angle;

    if (type === "move") {
      const dx = e.clientX - startMousePos.x;
      const dy = e.clientY - startMousePos.y;
      newPos = {
        x: startElementPos.x + dx,
        y: startElementPos.y + dy,
      };
      setPosition(newPos);
    }

    if (type === "resize") {
      if (!width) return;

      const dy = e.clientY - startMousePos.y;

      if (dir === "br") {
        newScale = Math.max(0.5, scale + dy / width);
        newPos.x = startElementPos.x - dy / 2;
      } else if (dir === "bl") {
        newScale = Math.max(0.5, scale + dy / width);
        newPos.x = startElementPos.x - dy / 2;
      } else if (dir === "tl") {
        newScale = Math.max(0.5, scale - dy / width);
        const scaleChange = newScale - scale;

        const pixelChange = scaleChange * height;

        newPos.y = startElementPos.y - pixelChange / 2;
        newPos.x = startElementPos.x + dy / 2;
      } else if (dir === "tr") {
        newScale = Math.max(0.5, scale - dy / width);
        const scaleChange = newScale - scale;

        const pixelChange = scaleChange * height;

        newPos.y = startElementPos.y - pixelChange / 2;
        newPos.x = startElementPos.x + dy / 2;
      }

      setPosition(newPos);
      setScale(newScale);
    }

    if (type == "rotate") {
      
      const box = initialValue?.element;

      if (box) {
        const rect = box.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        newAngle = Math.round((newAngle + 360) % 360);

        setAngle(newAngle);
      }
    }

    if (onDragging) {
      onDragging({
        e,
        scale: newScale,
        position: newPos,
        angle: newAngle,
        type,
      });
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
    setScale(1);
    setType(null);
    setAngle(0);

    if (onDragEnd) {
      onDragEnd({ type });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging, startMousePos, startElementPos]);

  return { position, isDragging, startDrag, setPosition, scale };
}
