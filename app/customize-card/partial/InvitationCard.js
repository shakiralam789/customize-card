"use client";
import CcContext from "@/context/ccContext";
import React, { useContext, useEffect } from "react";
import DraggableWrapper from "@/components/DraggableWrapper";

export default function InvitationCard() {
  const {
    allText,
    setAllText,
    ignoreBlurRef,
    setActiveEditIndex,
    editableRefs,
  } = useContext(CcContext);

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

      updatedText.forEach((textItem, index) => {
        const element = editableRefs.current[index];
        if (element) {
          element.innerHTML = textItem.isPlaceholder
            ? "Enter text..."
            : textItem.text || "";
        }
      });
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
          return (
            <DraggableWrapper
              className={`${text.active ? "active" : ""} movable-handle-parent`}
              initialPosition={text.position}
              key={index}
              textObj={text}
              element={editableRefs.current[index]}
              index={index}
            >
              {({ isDragging }) => (
                <>
                  <div
                    ref={(el) => (editableRefs.current[index] = el)}
                    contentEditable={text.contentEditable}
                    suppressContentEditableWarning
                    className={`${
                      text.active ? "active" : ""
                    } movable-handle p-2 focus:outline-none ${
                      text.isPlaceholder ? "!text-[#20f39b]" : "text-white"
                    } ${isDragging ? "movable-handle-hover" : ""}`}
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
                </>
              )}
            </DraggableWrapper>
          );
        })}
    </div>
  );
}
