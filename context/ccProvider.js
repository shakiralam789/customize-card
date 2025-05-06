// context/CcProvider.js
"use client";
import { act, useEffect, useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";

const defText = {
  itemType: "text",
  position: { x: 200, y: 100 },
  fontSize: 16,
  textAlign: "center",
  color: "white",
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

const staticData = [
  {
    id: uuid4(),
    name: "Sticker",
    itemType: "sticker",
    src: "/images/stickers/birthday-invitation.png",
    alt: "birthday-invitation",
    ...defSticker,
    position: { x: 135, y: 284 },
  },
  {
    id: uuid4(),
    name: "Invitation Letter",
    itemType: "text",
    text: `<div>Saturday, June 17, 2025</div>
          <div>at three o'clock in the afternoon</div>
          <div>Grace Community Church</div>`,
    isPlaceholder: false,
    position: { x: 38, y: 148 },
    fontSize: 14,
    contentEditable: false,
    textAlign: "center",
    color: "#c6a489",
    fontWeight: "normal",
    lineHeight: "2",
    fontStyle: "normal",
    letterSpacing: "0",
    textTransform: "uppercase",
    active: false,
    rotate: 0,
  },
  {
    id: uuid4(),
    name: "Address",
    itemType: "text",
    text: `<div>4551 East Street Wilmot, Virginia</div>`,
    isPlaceholder: false,
    position: { x: 77, y: 242 },
    fontSize: 12,
    contentEditable: false,
    textAlign: "center",
    color: "#7db2bd",
    fontWeight: "normal",
    lineHeight: "2",
    fontStyle: "normal",
    letterSpacing: "0",
    textTransform: "none",
    active: false,
  },
];

const CcProvider = ({ children }) => {
  const [zoom, setZoom] = useState(100);
  const [showCenterLine, setShowCenterLine] = useState(false);
  const [horizontalCentralLine, setHorizontalCentralLine] = useState(false);

  const parentRef = useRef(null);
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const shouldBeSelected = useRef(true);

  const [activeID, setActiveID] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});

  const [allItems, setAllItems] = useState([]);

  function addNewText() {
    const id = uuid4();

    setAllItems((prevItems) => {
      // Update zIndex and active state for all existing items
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
  }

  function addNewSticker(e, data) {
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

  function addToLocalStorage() {
    localStorage.setItem("customize-card-items", JSON.stringify(allItems));
  }

  function addZoomToLocalStorage(value) {
    localStorage.setItem("customize-card-zoom", value);
  }

  useEffect(() => {
    let items = localStorage.getItem("customize-card-items");
    let zoom = localStorage.getItem("customize-card-zoom");

    if (zoom) {
      setZoom(zoom);
    }

    if (items) {
      items = JSON.parse(items);
    } else {
      items = staticData || [];
    }

    if (items && items.length > 0) {
      const updatedItem = items.map((item, index) => {
        let newItem = {
          ...item,
          zIndex: 10 + index,
          name: item.name ? item.name : `Layer ${index + 1}`,
          // here calculation for zoom
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
  }, []);

  useEffect(() => {
    // addToLocalStorage();
  }, [allItems]);

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
        addZoomToLocalStorage,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
