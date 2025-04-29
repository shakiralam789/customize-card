// context/CcProvider.js
"use client";
import { useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";

const CcProvider = ({ children }) => {
  const [activeEditIndex, setActiveEditIndex] = useState(null);

  const ignoreBlurRef = useRef(false);

  const [allText, setAllText] = useState([
    {
      id: uuid4(),
      text: "<div>Welcome Come</div><div>Home</div>",
      isPlaceholder: false,
      position: { x: 200, y: 200 },
      fontSize: 16,
      contentEditable: true,
      textAlign: "center",
      color: "#fffff",
      fontWeight: "normal",
      lineHeight: "1.2",
      fontStyle: "normal",
      letterSpacing: "0",
      textTransform: "none",
      active: false,
    },
  ]);
  function addNewText() {
    
    let newText = [...allText].map((item) => {
      return { ...item, active: false };
    });

    setAllText([
      ...newText,
      {
        id: uuid4(),
        text: "",
        isPlaceholder: true,
        position: { x: 200, y: 100 },
        fontSize: 20,
        contentEditable: true,
        textAlign: "center",
        color: "white",
        fontWeight: "normal",
        lineHeight: "1.2",
        fontStyle: "normal",
        letterSpacing: "0",
        textTransform: "none",
        active: true,
      },
    ]);

    setActiveEditIndex(allText.length);
  }

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

    // Get the current HTML content directly from the DOM element
    const htmlContent = e.currentTarget.innerHTML;

    if (htmlContent.trim() === "") {
      // If empty, set placeholder
      newText[index].isPlaceholder = true;
      newText[index].text = "";
      e.currentTarget.innerHTML = "Enter text...";
    } else {
      // Save the HTML content
      newText[index].isPlaceholder = false;
      newText[index].text = htmlContent;
    }

    setAllText(newText);
  };

  return (
    <CcContext.Provider
      value={{
        allText,
        setAllText,
        addNewText,
        ignoreBlurRef,
        activeEditIndex,
        setActiveEditIndex,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
