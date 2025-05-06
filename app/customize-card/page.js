// pages/index.js
"use client";
import { useState, useEffect, useRef, useContext } from "react";
import Head from "next/head";
import Nav from "./partial/Nav";
import InvitationCard from "./partial/InvitationCard";
import EditPanelBar from "./partial/EditorPanel/EditPanelBar";
import CcContext from "@/context/ccContext";

export default function Home() {
  const { zoom, setZoom, addZoomToLocalStorage } = useContext(CcContext);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) {
        e.preventDefault();
      }
    };

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Reset position when zoom changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [zoom]);

  const handleZoomChange = (e) => {
    setZoom(parseInt(e.target.value));
    addZoomToLocalStorage(e.target.value);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".move-icon")) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (e.target.closest(".move-icon")) return;
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoom(100);
    addZoomToLocalStorage(100);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="overflow-hidden h-screen bg-gray-100">
      <Head>
        <title>Invitation Card Customizer</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <style>{`
          html {
            touch-action: none;
          }
        `}</style>
      </Head>

      {/* Top Navigation Bar */}
      <Nav />
      <EditPanelBar />
      {/* Main Content Area */}
      <div>
        <div
          className="cursor-move flex flex-col items-center justify-center p-4 relative overflow-hidden"
          style={{ height: "calc(100vh - 54px)" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Invitation Card */}
          <div
            className="invitation-card relative cursor-default"
            style={{
              transform: `scale(${zoom / 100}) translate(${
                position.x / (zoom / 100)
              }px, ${position.y / (zoom / 100)}px)`,
              transformOrigin: "center",
              transition: isDragging ? "none" : "transform 0.2s ease",
            }}
          >
            <InvitationCard zoomLevel={zoom / 100} />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3">
          <button
            onClick={resetZoom}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <input
            type="range"
            min="50"
            max="200"
            value={zoom}
            onChange={handleZoomChange}
            className="w-36 accent-teal-500"
          />

          <button className="p-1 rounded hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
