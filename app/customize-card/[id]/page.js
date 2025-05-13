"use client";
import React, { useContext, useEffect } from "react";
import InvitationCard from "../partial/InvitationCard";
import CustomizeCardLayout from "../partial/CustomizeCardLayout";
import CcContext from "@/context/ccContext";
import { useParams } from "next/navigation";
import { addToLocalStorage } from "@/helper/helper";

export default function Page() {
  const contextProps = useContext(CcContext);
  const { id } = useParams();
  const hasMounted = React.useRef(false);

  useEffect(() => {
    if (id) {
      contextProps.getDataOnLoad(id);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    if (hasMounted.current) {
      addToLocalStorage({
        id,
        allItems: contextProps.allItems,
        frame: contextProps.frame,
      });
    }

    if (!hasMounted.current && contextProps.allItems.length > 0) {
      hasMounted.current = true;
    }
  }, [contextProps.activeID]);

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
