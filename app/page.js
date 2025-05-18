"use client";

import CircleType from "@/components/CircleType";
import { useState } from "react";

const CircleTypeDemo = () => {
  const [radiusPercent, setRadiusPercent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [text, setText] = useState(
    "This is a demonstration of curved text"
  );

  // Combine direction and magnitude
  const effectiveRadius = direction * radiusPercent;

  // Preset percentages for quick testing
  const presets = [
    { name: "Flat (0%)", value: 0 },
    { name: "Slight Curve (5%)", value: 5 },
    { name: "Quarter Circle (25%)", value: 25 },
    { name: "Half Circle (50%)", value: 50 },
    { name: "90% Circle", value: 90 },
    { name: "Full Circle (100%)", value: 100 },
  ];

  return (
    <div className="text-black p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Visualization
        </h2>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-white"
          style={{ minHeight: "300px" }}
        >
          <div className="relative" style={{ fontSize: "16px" }}>
            <CircleType
              text={text}
              radiusPercent={effectiveRadius}
              initialForceHeight={true}
              initialForceWidth={true}
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Controls</h2>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Radius Percentage: {radiusPercent}%
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={radiusPercent}
                onChange={(e) => setRadiusPercent(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CircleTypeDemo;
