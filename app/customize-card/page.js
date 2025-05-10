"use client";
import React, { useContext, useEffect } from "react";
import InvitationCard from "./partial/InvitationCard";
import CustomizeCardLayout from "./partial/CustomizeCardLayout";
import CcContext from "@/context/ccContext";
import { addToLocalStorage } from "@/helper/helper";

export default function Page() {
  const contextProps = useContext(CcContext);

  const hasMounted = React.useRef(false);

  useEffect(() => {
    contextProps.getDataOnLoad();
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      addToLocalStorage({
        allItems: contextProps.allItems,
        frame: contextProps.frame,
      });
    }

    if (!hasMounted.current && contextProps?.allItems.length > 0) {
      hasMounted.current = true;
    }
  }, [contextProps?.allItems]);

  return (
    <CustomizeCardLayout
      zoom={contextProps.zoom}
      setZoom={contextProps.setZoom}
    >
      <InvitationCard
        contextProps={{ ...contextProps, zoomLevel: contextProps.zoom / 100 }}
      />
    </CustomizeCardLayout>
  );
}
