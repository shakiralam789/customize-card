"use client";
import { useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";
import cardData from "../data/cardData";

const defText = {
  itemType: "text",
  position: { x: 200, y: 100 },
  fontSize: 16,
  textAlign: "center",
  color: "black",
  fontWeight: "normal",
  lineHeight: "1.2",
  fontStyle: "normal",
  letterSpacing: "0",
  textTransform: "none",
  textCurve: 0,
  rotate: 0,
  isPlaceholder: true,
  fontFamily: "Arial",
};

const defSticker = {
  itemType: "sticker",
  position: { x: 200, y: 200 },
  width: 100,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
};

const CcProvider = ({ children }) => {
  const [zoom, setZoom] = useState(100);
  const [showCenterLine, setShowCenterLine] = useState(false);
  const [horizontalCentralLine, setHorizontalCentralLine] = useState(false);
  const [isAnyItemDragging, setIsAnyItemDragging] = useState(false);

  const parentRef = useRef(null);
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const shouldBeSelected = useRef(true);

  const [activeID, setActiveID] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});

  const [allItems, setAllItems] = useState([]);
  const [frame, setFrame] = useState({});

  function addNewText() {
    const id = uuid4();

    setAllItems((prevItems) => {
      const updatedItems = prevItems.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
        active: false,
      }));

      return [
        ...updatedItems,
        {
          id: id,
          text: "",
          active: true,
          contentEditable: true,
          zIndex: 10 + prevItems.length,
          name: "Text",

          ...defText,
        },
      ];
    });

    setActiveID(id);
    shouldBeSelected.current = true;
  }

  function addNewSticker(data) {
    setAllItems((prevItems) => {
      const itemsWithNewSticker = [
        ...prevItems,
        {
          id: uuid4(),
          ...defSticker,
          ...data,
          name: "Sticker",
        },
      ];

      return itemsWithNewSticker.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
      }));
    });

    setActiveID(null);
    setIsStickerDrawerOpen(false);
  }
  function deleteField() {
    if (!activeID) return;

    setAllItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.id !== activeID);
      const updatedItems = filteredItems.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
      }));

      return updatedItems;
    });

    setActiveID(null);
  }

  function getDataOnLoad(id) {
    let items = [];
    let frameData = {};
    // let zoom = 100;

    let storageName = `customize-card-data${id || ""}`;

    let localTItems = localStorage.getItem(storageName);

    if (localTItems) {
      let parseItems = JSON.parse(localTItems);
      if (parseItems) {
        items = parseItems?.data?.items || [];
        frameData = parseItems?.data?.frame || {};
      }
    } else if (id) {
      let findData = cardData.find((d) => d.id === id);
      if (findData) {
        items = findData.data.items || [];
        frameData = findData.data.frame || {};
      }
    }

    if (items && items.length > 0) {
      const updatedItem = items.map((item, index) => {
        let newItem = {
          ...item,
          zIndex: 10 + index,
          name: item.name ? item.name : `Layer ${index + 1}`,
          active: false,
        };
        if (!newItem.position) {
          return { ...newItem, position: { x: 0, y: 0 } };
        }
        return newItem;
      });

      setAllItems(updatedItem);

      setTimeout(() => {
        updatedItem.forEach((item, index) => {
          if (item.itemType === "text") {
            const element = itemsRefs.current[item.id];

            if (element) {
              element.innerHTML = item.isPlaceholder
                ? "Enter text..."
                : item.text || "";
            }
          }
        });
      }, 0);
    }

    setFrame(frameData);
  }

  return (
    <CcContext.Provider
      value={{
        allItems,
        setAllItems,
        addNewText,
        addNewSticker,
        ignoreBlurRef,
        activeID,
        setActiveID,
        itemsRefs,
        isStickerDrawerOpen,
        setIsStickerDrawerOpen,
        shouldBeSelected,
        defText,
        defSticker,
        deleteField,
        showCenterLine,
        setShowCenterLine,
        parentRef,
        horizontalCentralLine,
        setHorizontalCentralLine,
        zoom,
        setZoom,
        getDataOnLoad,
        frame,
        setFrame,
        isAnyItemDragging,
        setIsAnyItemDragging,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
