"use client";
import { useEffect, useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";
import cardData from "../data/cardData";
import { getCurvedTextHTML, managePosition } from "@/helper/helper";
import _cloneDeep from "lodash/cloneDeep";

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
  const [allItems, setAllItems] = useState([]);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const isUndoingOrRedoing = useRef(false);

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

      undoStack.current = [_cloneDeep(updatedItem)];
      redoStack.current = [];

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

    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.width = `${position.width}px`;
      mainRefs.current[activeID].style.height = `${position.height}px`;
    }

    if (handlerRefs.current[activeID]) {
      handlerRefs.current[activeID].style.width = `${position.width}px`;
      handlerRefs.current[activeID].style.height = `${position.height}px`;
    }

    return position;
  }

  function updateElementState(position, fontSize) {
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

  const lastRecordedState = useRef(null);
  const isDebouncingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isUndoingOrRedoing.current) {
      isUndoingOrRedoing.current = false;
      return;
    }

    if (allItems.length === 0 && undoStack.current.length > 0) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const stateHash = JSON.stringify(allItems);

      if (lastRecordedState.current !== stateHash) {
        undoStack.current.push(_cloneDeep(allItems));
        redoStack.current = [];

        lastRecordedState.current = stateHash;
      }

      timerRef.current = null;
    }, 100);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [allItems]);

  const updateItems = (newItems) => {
    setAllItems(newItems);
  };

  const undo = () => {

    if (undoStack.current.length <= 1) return;

    const currentState = _cloneDeep(allItems);

    undoStack.current.pop();

    const previousState = undoStack.current[undoStack.current.length - 1];

    redoStack.current.push(currentState);

    isUndoingOrRedoing.current = true;

    setAllItems(_cloneDeep(previousState));

    console.log(previousState);
    
    setTimeout(() => {
      previousState.forEach((item) => {
        if (item.active) {
          setActiveID(item.id);
        }

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
  };

  // Redo function
  const redo = () => {
    
    if (redoStack.current.length === 0) return;

    const nextState = redoStack.current.pop();

    isUndoingOrRedoing.current = true;

    setAllItems(_cloneDeep(nextState));

    undoStack.current.push(_cloneDeep(nextState));

    setTimeout(() => {
      nextState.forEach((item) => {
        if (item.active) {
          setActiveID(item.id);
        }
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
  };

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
        undo,
        redo,
        updateItems,
        undoStack,
        redoStack,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
