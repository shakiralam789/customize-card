// context/CcProvider.js
"use client";
import { useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";

const CcProvider = ({ children }) => {
  const defText = {
    itemType: "text",
    position: { x: 200, y: 100 },
    fontSize: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "normal",
    lineHeight: "1.2",
    fontStyle: "normal",
    letterSpacing: "0",
    textTransform: "none",
    textCurve: 0,
    rotate: 0,
  };

  const defSticker = {
    itemType: "sticker",
    position: { x: 200, y: 200 },
    width: 100,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  };

  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const [shouldBeSelected, setShouldBeSelected] = useState(true);

  const [activeIndex, setActiveIndex] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});

  const [allItems, setAllItems] = useState([
    {
      id: uuid4(),
      itemType: "sticker",
      src: "/images/stickers/birthday-invitation.png",
      alt: "birthday-invitation",
      ...defSticker,
      position: { x: 200, y: 368 },
    },
    {
      id: uuid4(),
      itemType: "text",
      text: `<div>Saturday, June 17, 2025</div>
            <div>at three o'clock in the afternoon</div>
            <div>Grace Community Church</div>`,
      isPlaceholder: false,
      position: { x: 67, y: 200 },
      fontSize: 18,
      contentEditable: false,
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
      itemType: "text",
      text: `<div>4551 East Street Wilmot, Virginia</div>`,
      isPlaceholder: false,
      position: { x: 125, y: 310 },
      fontSize: 16,
      contentEditable: false,
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
    let newItem = [...allItems].map((item, index) => {
      return { ...item, zIndex: 10 + index, active: false };
    });

    setAllItems([
      ...newItem,
      {
        id: uuid4(),
        text: "",
        isPlaceholder: true,
        active: true,
        contentEditable: true,
        zIndex: 10 + allItems.length,
        ...defText,
      },
    ]);

    setActiveIndex(allItems.length);
  }

  function addNewSticker(e, data) {
    let newItem = [...allItems];

    newItem.push({
      ...data,
      ...defSticker,
    });

    newItem = newItem.map((item, index) => {
      return { ...item, zIndex: 10 + index };
    });

    setAllItems(newItem);
    setActiveIndex(null);

    setIsStickerDrawerOpen(false);
  }

  function deleteField() {
    let newItem = [...allItems];
    newItem.splice(activeIndex, 1);

    newItem = newItem.map((item, index) => {
      return { ...item, zIndex: 10 + index };
    });

    setAllItems(newItem);
    setActiveIndex(null);
  }

  return (
    <CcContext.Provider
      value={{
        allItems,
        setAllItems,
        addNewText,
        addNewSticker,
        ignoreBlurRef,
        activeIndex,
        setActiveIndex,
        itemsRefs,
        isStickerDrawerOpen,
        setIsStickerDrawerOpen,
        shouldBeSelected,
        setShouldBeSelected,
        defText,
        defSticker,
        deleteField,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
