"use client";
import { applyCurvedText, cleanupCurvedText } from "@/helper/helper";
import React, { useEffect, useRef, useState } from "react";

const CurvedTextComponent = ({
  text: initialText = "Hello Curved World",
  curvePercent: initialCurvePercent = 0,
}) => {
  const [curvePercent, setCurvePercent] = useState(initialCurvePercent);
  const [text, setText] = useState(initialText);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Apply curved text effect
  useEffect(() => {
    if (!containerRef.current) return;

    const result = applyCurvedText(containerRef.current, text, curvePercent);
    
    console.log(result);
    
    setDimensions({
      width: result.width,
      height: result.height,
    });

    return () => {
      if (containerRef.current) {
        cleanupCurvedText(containerRef.current);
      }
    };
  }, [text, curvePercent]);

  return (
    <div className="text-black flex flex-col items-center space-y-6">
      <div className="border border-gray-300 flex items-center justify-center min-h-[200px] p-8 w-full">
        <div
          ref={containerRef}
          className="text-2xl font-semibold"
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {/* Empty - will be populated by the helper */}
        </div>
      </div>

      {/* Dimensions Info */}
      <div className="text-sm bg-gray-100 p-2 rounded w-full max-w-md text-center">
        Width: {dimensions.width}px | Height: {dimensions.height}px
      </div>

      {/* Controls */}
      <div className="w-full max-w-md space-y-4">
        {/* Curve Percentage Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curve: {curvePercent}%
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={curvePercent}
            onChange={(e) => setCurvePercent(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-100% ↓</span>
            <span>0% (Straight)</span>
            <span>+100% ↑</span>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default CurvedTextComponent;
