// context/CcProvider.js
"use client";
import { useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";

const CcProvider = ({ children }) => {
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const [activeEditIndex, setActiveEditIndex] = useState(null);
  const [activeStickerIndex, setActiveStickerIndex] = useState(null);

  const ignoreBlurRef = useRef(false);
  const editableRefs = useRef({});
  const stickerRefs = useRef({});

  const [stickers, setStickers] = useState([]);

  const [allText, setAllText] = useState([
    {
      id: uuid4(),
      text: `<div>Saturday, June 17, 2025</div>
            <div>at three o'clock in the afternoon</div>
            <div>Grace Community Church</div>`,
      isPlaceholder: false,
      position: { x: 67, y: 200 },
      fontSize: 18,
      contentEditable: true,
      textAlign: "center",
      color: "rgb(255, 163, 72)",
      fontWeight: "normal",
      lineHeight: "2",
      fontStyle: "normal",
      letterSpacing: "0",
      textTransform: "uppercase",
      active: false,
    },
    {
      id: uuid4(),
      text: `<div>4551 East Street Wilmot, Virginia</div>`,
      isPlaceholder: false,
      position: { x: 125, y: 310 },
      fontSize: 16,
      contentEditable: true,
      textAlign: "center",
      color: "#7faeb9",
      fontWeight: "normal",
      lineHeight: "2",
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
        textCurve: 0,
      },
    ]);

    setActiveEditIndex(allText.length);
  }

  function addNewSticker(e,data) {
    let newStickers = [...stickers]

    newStickers.push({
      ...data,
      position: { x: 200, y: 200 },
      width: 100
    });

    setStickers(newStickers);
    setActiveStickerIndex(newStickers.length);
    console.log('asd');
    
    setIsStickerDrawerOpen(false);
  }

  return (
    <CcContext.Provider
      value={{
        allText,
        setAllText,
        addNewText,
        ignoreBlurRef,
        activeEditIndex,
        activeStickerIndex,
        setActiveEditIndex,
        setActiveStickerIndex,
        editableRefs,
        stickerRefs,
        isStickerDrawerOpen,
        setIsStickerDrawerOpen,
        addNewSticker,
        stickers,
        setStickers,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
