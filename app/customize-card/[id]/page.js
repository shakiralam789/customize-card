"use client";
import React, { useContext, useEffect } from "react";
import InvitationCard from "../partial/InvitationCard";
import CustomizeCardLayout from "../partial/CustomizeCardLayout";
import CcContext from "@/context/ccContext";
import { useParams } from "next/navigation";
import { addToLocalStorage } from "@/helper/helper";

export default function Page() {
  const {
    zoom,
    setZoom,
    addZoomToLocalStorage,
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

  const { id } = useParams();
  const hasMounted = React.useRef(false);

  useEffect(() => {
    if (id) {
      getDataOnLoad(id);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    if (hasMounted.current) {
      addToLocalStorage({ id, allItems, frame });
    }

    if (!hasMounted.current && allItems.length > 0) {
      hasMounted.current = true;
    }
  }, [allItems, frame]);

  return (
    <CustomizeCardLayout
      zoom={zoom}
      setZoom={setZoom}
      addZoomToLocalStorage={addZoomToLocalStorage}
    >
      <InvitationCard
        setZoom={setZoom}
        addZoomToLocalStorage={addZoomToLocalStorage}
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
