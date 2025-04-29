"use client";
import CcContext from "@/context/ccContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Move } from "lucide-react";

export default function InvitationCard() {
  const { allText, setAllText, ignoreBlurRef, setActiveEditIndex } =
    useContext(CcContext);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState({ x: 0, y: 0 });
  // Store refs for each editable element
  const editableRefs = useRef({});

  useEffect(() => {
    if (allText && allText.length > 0) {
      const updatedText = allText.map((item) => {
        if (!item.position) {
          return { ...item, position: { x: 0, y: 0 } };
        }
        return item;
      });

      if (JSON.stringify(updatedText) !== JSON.stringify(allText)) {
        setAllText(updatedText);
      }

      setTimeout(() => {
        updatedText.forEach((textItem, index) => {
          const element = editableRefs.current[index];
          if (element) {
            element.innerHTML = textItem.isPlaceholder
              ? "Enter text..."
              : textItem.text || "";
          }
        });
      }, 0);
    }
  }, []);

  const handleFocus = (e, index) => {
    let plch = allText[index].isPlaceholder;
    let newText = [...allText];

    newText[index].active = true;
    setActiveEditIndex(index);
    if (plch) {
      e.currentTarget.innerHTML = "";
      newText[index].isPlaceholder = false;
    }

    setAllText(newText);
  };

  const handleBlur = (e, index) => {
    if (ignoreBlurRef.current) {
      setTimeout(() => {
        if (editableRefs.current[index]) {
          editableRefs.current[index].focus();
        }
      }, 0);
      return;
    }

    let newText = [...allText];
    newText[index].active = false;
    setActiveEditIndex(null);

    const htmlContent = e.currentTarget.innerHTML;

    if (htmlContent.trim() === "") {
      newText[index].isPlaceholder = true;
      newText[index].text = "";
      e.currentTarget.innerHTML = "Enter text...";
    } else {
      newText[index].isPlaceholder = false;
      newText[index].text = htmlContent;
    }

    setAllText(newText);
  };

  // Handle mouse down to start dragging
  const startDrag = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDragIndex(index);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setElementStartPos({
      x: allText[index].position?.x || 0,
      y: allText[index].position?.y || 0,
    });
  };

  // Handle mouse move during drag
  const handleDrag = (e) => {
    if (!isDragging || dragIndex === null) return;

    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;

    const newTextArray = [...allText];
    newTextArray[dragIndex] = {
      ...newTextArray[dragIndex],
      position: {
        x: elementStartPos.x + dx,
        y: elementStartPos.y + dy,
      },
    };

    setAllText(newTextArray);
  };

  // Handle mouse up to end dragging
  const endDrag = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", endDrag);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", endDrag);
    };
  }, [isDragging, dragIndex, dragStartPos, elementStartPos, allText]);

  return (
    <div
      className="overflow-hidden p-4 bg-gray-800 bg-no-repeat bg-cover relative"
      style={{
        width: "500px",
        height: "700px",
        backgroundImage: "url('/images/inv-card.jpg')",
      }}
    >
      {allText &&
        allText.length > 0 &&
        allText.map((text, index) => {
          // Get position values, defaulting to 0 if undefined
          const posX = text.position?.x || 0;
          const posY = text.position?.y || 0;

          // Check if this specific element is being dragged
          const isThisElementDragging = isDragging && dragIndex === index;

          return (
            <div
              key={text.id}
              className={`movable-handle-parent group absolute w-fit min-w-[40px] min-h-[50px] ${
                isThisElementDragging ? "z-10" : "z-0"
              }`}
              style={{
                left: `${posX}px`,
                top: `${posY}px`,
                cursor: isThisElementDragging ? "grabbing" : "default",
              }}
            >
              {/* Move Icon */}
              <div
                className={`absolute -right-2 -top-0 transform -translate-y-1/2 cursor-move 
                          bg-gray-800 p-1 rounded hover:bg-gray-700 z-10
                          ${
                            isThisElementDragging
                              ? "block"
                              : "hidden group-hover:block"
                          }`}
                onMouseDown={(e) => startDrag(e, index)}
              >
                <Move size={16} className="move-icon text-white" />
              </div>

              <div
                ref={(el) => (editableRefs.current[index] = el)}
                contentEditable={text.contentEditable}
                suppressContentEditableWarning
                className={`${
                  text.active ? "active" : ""
                } movable-handle p-2 focus:outline-none ${
                  text.isPlaceholder ? "!text-[#20f39b]" : "text-white"
                } ${isThisElementDragging ? "movable-handle-hover" : ""}`}
                onFocus={(e) => handleFocus(e, index)}
                onBlur={(e) => handleBlur(e, index)}
                
                style={{
                  fontSize: `${text?.fontSize}px`,
                  textAlign: `${text?.textAlign}`,
                  color: `${text?.color}`,
                  fontWeight: `${text?.fontWeight}`,
                  fontStyle: `${text?.fontStyle}`,
                  lineHeight: `${text?.lineHeight}`,
                  letterSpacing: `${text?.letterSpacing}px`,
                  textTransform: `${text?.textTransform}`,
                }}
              >
                Enter Text...
              </div>
            </div>
          );
        })}
    </div>
  );
}
