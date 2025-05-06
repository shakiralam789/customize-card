"use client";
import React, { useRef, useState, useEffect } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10 relative">
      <div
        className="relative w-[600px] h-[400px] bg-white overflow-hidden border border-gray-300 shadow-md"
        id="canvas"
      >
        <EditableTextBox />
      </div>
    </div>
  );
}

function EditableTextBox() {
  const boxRef = useRef(null);
  const textRef = useRef(null);

  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [size, setSize] = useState({ width: 200, height: 100 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startSize, setStartSize] = useState({ width: 200, height: 100 });
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({});
  const [handlePos, setHandlePos] = useState({ top: 0, left: 0 });

  const baseFontSize = 16;
  const baseWidth = 200;

  const updateHandlePosition = () => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setHandlePos({
        top: rect.top + rect.height - 6,
        left: rect.left + rect.width - 6,
      });
    }
  };

  const onMouseDownResize = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartMouse({ x: e.clientX, y: e.clientY });
    setStartSize(size);
  };

  const onMouseDownDrag = (e) => {
    if (e.target.classList.contains("resize-handle")) return;
    setIsDragging(true);
    setStartMouse({ x: e.clientX, y: e.clientY });
    setStartPos(position);
  };

  const onMouseMove = (e) => {
    if (isResizing) {
      const dx = e.clientX - startMouse.x;
      const dy = e.clientY - startMouse.y;
      const newWidth = Math.max(50, startSize.width + dx);
      const newHeight = Math.max(30, startSize.height + dy);
      setSize({ width: newWidth, height: newHeight });

      const scale = newWidth / baseWidth;
      if (textRef.current) {
        textRef.current.style.fontSize = `${baseFontSize * scale}px`;
      }
    }

    if (isDragging) {
      const dx = e.clientX - startMouse.x;
      const dy = e.clientY - startMouse.y;
      setPosition({
        top: startPos.top + dy,
        left: startPos.left + dx,
      });
    }
  };

  const stopInteraction = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopInteraction);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopInteraction);
    };
  });

  // Update handle position on box move or resize
  useEffect(() => {
    updateHandlePosition();
  }, [position, size]);

  return (
    <>
      {/* Text box INSIDE canvas (gets clipped) */}
      <div
        ref={boxRef}
        onMouseDown={onMouseDownDrag}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          width: size.width,
          height: size.height,
          userSelect: "none",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px dashed #007aff",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "move",
          }}
        >
          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            className="text-black w-full px-2"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              textAlign: "center",
              fontSize: `${baseFontSize}px`,
              overflow: "hidden",
            }}
          >
            Edit me
          </div>
        </div>
      </div>

      {/* Resize handle OUTSIDE canvas (always visible) */}
      <div
        className="resize-handle"
        onMouseDown={onMouseDownResize}
        style={{
          position: "fixed",
          top: handlePos.top,
          left: handlePos.left,
          width: 12,
          height: 12,
          background: "#007aff",
          borderRadius: "50%",
          cursor: "nwse-resize",
          zIndex: 9999,
        }}
      />
    </>
  );
}
