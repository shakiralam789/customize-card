"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";
import cardData from "../data/cardData";
import {
  applyCurvedText,
  getCurvedTextHTML,
  isTextOneLine,
  managePosition,
  textCurveController,
} from "@/helper/helper";
import _cloneDeep from "lodash/cloneDeep";

const defText = {
  itemType: "text",
  position: { x: 130, y: 100 },
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
  const [frame, setFrame] = useState({});

  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const [guides, setGuides] = [];

  const isUndoingOrRedoing = useRef(false);

  const [zoom, setZoom] = useState(100);
  const [showCenterLine, setShowCenterLine] = useState(false);
  const [horizontalCentralLine, setHorizontalCentralLine] = useState(false);
  const [isAnyItemDragging, setIsAnyItemDragging] = useState(false);
  const fontChangeInProgress = useRef(false);

  const parentRef = useRef(null);

  const shouldBeSelected = useRef(true);

  const [activeID, setActiveID] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});
  const handlerRefs = useRef({});
  const mainRefs = useRef({});
  const scrollRef = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);


  const debounceTimerRef = useRef(null);

  const debouncedSetAllItems = useCallback(
    (updateFn) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setAllItems(updateFn);
        debounceTimerRef.current = null;
      }, 150);
    },
    [setAllItems]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const addNewItem = useCallback((newData) => {
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
      return [
        ...updatedItems,
        { ...newData, zIndex: prevItems.length + 1 + 10, id },
      ];
    });

    setActiveID(id);
  }, []);

  const addNewText = useCallback(() => {
    addNewItem({
      text: "",
      active: true,
      contentEditable: true,
      width: 130,
      height: 36,
      name: "Text",
      ...defText,
    });

    shouldBeSelected.current = true;
  }, []);

  const addNewSticker = useCallback(
    (item) => {
      addNewItem({
        ...defSticker,
        ...item,
        active: true,
        name: "Sticker",
      });
    },
    [addNewItem]
  );
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
      console.log(parseItems);
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

        if (item.itemType === "text") {
          let isOneLine = isTextOneLine(item?.text);
          if (isOneLine.isOneLine) {
            newItem.isPlaceholder = false;
            newItem = {
              ...newItem,
              text: isOneLine.text,
            };
          }

          newItem = {
            ...newItem,
            contentEditable: false,
          };
        }

        if (!newItem.position) {
          return { ...newItem, position: { x: 0, y: 0 } };
        }
        return newItem;
      });

      setAllItems(updatedItem);

      undoStack.current = [_cloneDeep(updatedItem)];
      redoStack.current = [];
    }

    setFrame(frameData);
  }

  function updateElementDimensions(activeItem) {
    if (!activeID) return;

    let currentHandler = handlerRefs.current[activeID];
    let currentElement = itemsRefs.current[activeID];
    if (!currentElement) return;

    const position = managePosition({
      idol: currentElement,
      follower: currentHandler,
      scrollParent: scrollRef.current,
      item: activeItem || {},
    });
    return position;
  }

  function updateElementState(position, rest = {}) {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID
          ? {
              ...item,
              width: position.width,
              height: position.height,
              position: { y: position.top, x: position.left },
              ...rest,
            }
          : item
      )
    );
  }

  function updatePositionState(position, itemId = activeID, rest = {}) {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              width: position?.width || item.width,
              height: position?.height || item.height,
              position: {
                y: position?.top || item.position.y,
                x: position?.left || item.position.x,
              },
              ...rest,
            }
          : item
      )
    );
  }

  function updateElementDimensionsByFont({
    prevFont,
    currentFont,
    activeItem,
  }) {
    let fontIncrement = currentFont / prevFont;
    let width = activeItem.width * fontIncrement;
    let height = activeItem.height * fontIncrement;
    let dw = 0;
    dw = activeItem.width - width;

    if (activeItem && activeItem.textAlign == "center") {
      activeItem.position.x += dw / 2;
    } else if (activeItem && activeItem.textAlign == "right") {
      activeItem.position.x += dw;
    }

    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeItem?.id
          ? {
              ...item,
              width,
              height,
              position: { y: activeItem.position.y, x: activeItem.position.x },
              fontSize: currentFont || item.fontSize,
            }
          : item
      )
    );
  }

  const lastRecordedState = useRef(null);
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

    previousState.forEach((item) => {
      if (item.active) {
        setActiveID(item.id);
      }

      if (item.itemType === "text") {
        const element = itemsRefs.current[item.id];

        if (element) {
          updateInnerHTML({ element, item });
        }
      }
    });
    // setTimeout(() => {
    // }, 0);
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;

    const nextState = redoStack.current.pop();

    isUndoingOrRedoing.current = true;

    setAllItems(_cloneDeep(nextState));

    undoStack.current.push(_cloneDeep(nextState));

    // setTimeout(() => {
    // }, 0);
    nextState.forEach((item) => {
      if (item.active) {
        setActiveID(item.id);
      }
      if (item.itemType === "text") {
        const element = itemsRefs.current[item.id];

        if (element) {
          updateInnerHTML({ element, item });
        }
      }
    });
  };

  function updateInnerHTML({ element, item }) {
    if (element && item.itemType === "text") {
      if (item.isPlaceholder) {
        element.innerHTML = "Enter text...";
      } else {
        if (item?.textCurve && item?.textCurve !== 0) {
          async function fetchData() {
            let position = await textCurveController({
              element: element,
              mainElement: mainRefs.current[item.id],
              handleElement: handlerRefs.current[item.id],
              value: item?.textCurve,
              activeItem: item,
            });
            updatePositionState(position, item.id);
          }
          fetchData();
        } else {
          element.innerHTML = item?.text;
        }
      }
    }
  }

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Cinzel&family=Cormorant+Garamond&family=Cookie&family=Dancing+Script&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Marck+Script&family=Pacifico&family=Parisienne&family=Playfair+Display&family=Sacramento&family=Satisfy&family=Tangerine&display=swap');
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      setFontsLoaded(true);
    }, 500);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <CcContext.Provider
      value={{
        updateInnerHTML,
        allItems,
        setAllItems,
        addNewText,
        addNewSticker,
        ignoreBlurRef,
        activeID,
        setActiveID,
        itemsRefs,
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
        fontsLoaded,
        debouncedSetAllItems,
        updateElementDimensionsByFont,
        debounceTimerRef,
        updatePositionState,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
