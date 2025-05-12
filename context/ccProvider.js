"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";
import cardData from "../data/cardData";
import { getCurvedTextHTML, managePosition } from "@/helper/helper";

const defText = {
  itemType: "text",
  position: { x: 200, y: 100 },
  fontSize: 24,
  textAlign: "center",
  color: "black",
  fontWeight: "normal",
  lineHeight: "150",
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
  const fontChangeInProgress = useRef(false);

  const parentRef = useRef(null);
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const shouldBeSelected = useRef(true);

  const [activeID, setActiveID] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});
  const handlerRefs = useRef({});
  const mainRefs = useRef({});
  const scrollRef = useRef(null);

  const [allItems, setAllItems] = useState([]);
  const [frame, setFrame] = useState({});
  const [newAddedId, setNewAddedId] = useState(null);

  function addNewItem(newData) {
    const id = uuid4();
    setAllItems((prevItems) => {
      const updatedItems = prevItems.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
        active: false,
      }));
      if (newData.itemType === "text") {
        updatedItems.contentEditable = false;
      }
      return [...updatedItems, { ...newData, id }];
    });

    setActiveID(id);
    setNewAddedId(id);
  }

  function addNewText() {
    addNewItem({
      text: "",
      active: true,
      contentEditable: true,
      zIndex: 10 + allItems.length,
      name: "Text",
      ...defText,
    });

    shouldBeSelected.current = true;
  }

  function addNewSticker(data) {
    addNewItem({
      ...defSticker,
      ...data,
      active: true,
      zIndex: 10 + allItems.length,
      name: "Sticker",
    });

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
        updatedItem.forEach((item) => {
          if (item.itemType === "text") {
            const element = itemsRefs.current[item.id];

            if (element) {
              element.innerHTML = item.isPlaceholder
                ? "Enter text..."
                : getCurvedTextHTML(item?.text, item?.textCurve || 0);
            }
          }
        });
      }, 0);
    }

    setFrame(frameData);
  }

  function updateElementDimensions(callBack) {
    if (!activeID) return;

    let currentHandler = handlerRefs.current[activeID];
    let currentElement = itemsRefs.current[activeID];
    const parent = parentRef.current;

    if (!currentElement || !parent) return;

    const position = managePosition(
      {
        idol: currentElement,
        follower: currentHandler,
        parent,
        scrollParent: scrollRef.current,
      },
      false
    );

    if (callBack) {
      callBack(position);
    }
  }

  function updateElementState(position, fontSize) {
    if (!activeID || !position) return;

    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.width = `${position.width}px`;
      mainRefs.current[activeID].style.height = `${position.height}px`;
    }

    if (handlerRefs.current[activeID]) {
      handlerRefs.current[activeID].style.width = `${position.width}px`;
      handlerRefs.current[activeID].style.height = `${position.height}px`;
    }

    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              width: position.width,
              height: position.height,
              // position: { y: position.top, x: position.left },
              fontSize: fontSize || item.fontSize,
            }
          : item
      )
    );

    fontChangeInProgress.current = false;
  }

  useEffect(() => {
    if (newAddedId) {
      const el = itemsRefs.current[newAddedId];
      if (el) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const { width, height } = entry.contentRect;
            setAllItems((prevItems) => {
              const updatedItems = prevItems.map((item) => {
                if (item.id === newAddedId) {
                  return {
                    ...item,
                    width,
                    height,
                  };
                }
                return item;
              });
              return updatedItems;
            });
          }
        });

        resizeObserver.observe(el);

        return () => {
          resizeObserver.disconnect();
        };
      }
    }
  }, [newAddedId]);

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
        handlerRefs,
        mainRefs,
        scrollRef,
        updateElementDimensions,
        updateElementState,
        fontChangeInProgress,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
