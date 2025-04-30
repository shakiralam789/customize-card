'use client'
import React, { useRef, useState, useEffect } from "react";

export default function ScalableTextBox() {
  const boxRef = useRef(null);
  const textRef = useRef(null);

  const [isResizing, setIsResizing] = useState(false);
  const [original, setOriginal] = useState(null);
  const [scale, setScale] = useState(1);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const box = boxRef.current;

    if (box) {
      const rect = box.getBoundingClientRect();
      setOriginal({
        startX: e.clientX,
        startY: e.clientY,
        width: rect.width,
        scale,
      });
      setIsResizing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !original) return;

    const dx = e.clientX - original.startX;
    const newScale = Math.max(0.5, original.scale + dx / original.width);

    setScale(newScale);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      ref={boxRef}
      className="relative inline-block p-2 border border-blue-500 bg-black text-white"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        display: "inline-block",
        maxWidth: "100%",
        position: "absolute",
        top: 50,
        left: 50,
      }}
    >
      <div
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          minWidth: "50px",
          minHeight: "30px",
          outline: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        Resize me
      </div>

      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          width: "12px",
          height: "12px",
          backgroundColor: "white",
          borderRadius: "50%",
          bottom: "-6px",
          right: "-6px",
          cursor: "nwse-resize",
          border: "2px solid black",
        }}
      ></div>
    </div>
  );
}
