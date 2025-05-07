"use client";
import React, { useContext, useEffect } from "react";
import InvitationCard from "./partial/InvitationCard";
import CustomizeCardLayout from "./partial/CustomizeCardLayout";
import CcContext from "@/context/ccContext";
import { addToLocalStorage } from "@/helper/helper";

export default function Page() {
  const {
    zoom,
    setZoom,
    getDataOnLoad,
    allItems,
    activeID,
    setActiveID,
    itemsRefs,
    shouldBeSelected,
    defText,
    defSticker,
    showCenterLine,
    parentRef,
    setShowCenterLine,
    setAllItems,
    horizontalCentralLine,
    setHorizontalCentralLine,
    frame,
    setFrame,
  } = useContext(CcContext);

  const hasMounted = React.useRef(false);

  useEffect(() => {
    getDataOnLoad();
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      addToLocalStorage(allItems);
      hasMounted.current = true;
    }
  }, [allItems]);

  return (
    <CustomizeCardLayout
      zoom={zoom}
      setZoom={setZoom}
    >
      <InvitationCard
        setZoom={setZoom}
        getDataOnLoad={getDataOnLoad}
        allItems={allItems}
        activeID={activeID}
        setActiveID={setActiveID}
        itemsRefs={itemsRefs}
        shouldBeSelected={shouldBeSelected}
        defText={defText}
        defSticker={defSticker}
        showCenterLine={showCenterLine}
        parentRef={parentRef}
        setShowCenterLine={setShowCenterLine}
        setAllItems={setAllItems}
        horizontalCentralLine={horizontalCentralLine}
        setHorizontalCentralLine={setHorizontalCentralLine}
        zoomLevel={zoom / 100}
        frame={frame}
        setFrame={setFrame}
      />
    </CustomizeCardLayout>
  );
}
