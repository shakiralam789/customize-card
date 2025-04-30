import React, { useMemo } from "react";

const CurvedText = ({
  text = "Curved Text Example",
  curveValue = 0,
  style = {},
  className = "",
}) => {
  const charElements = useMemo(() => {
    const safeValue = Math.max(-100, Math.min(100, curveValue));
    const chars = text.split("");
    const maxRotation = safeValue * 0.4;

    return chars.map((char, index) => {
      if (char === " ") {
        return <span key={index}>&nbsp;</span>;
      }

      const position = chars.length > 1 ? index / (chars.length - 1) : 0.5;

      const curveDistribution = 1 - Math.abs(position - 0.5) * 2;

      const rotation = maxRotation * curveDistribution;

      const transform =
        safeValue < 0 ? `rotateX(${rotation}deg)` : `rotateX(${-rotation}deg)`;

      // Calculate horizontal position adjustment for more realistic curve
      // More curvature means characters need more horizontal adjustment
      const translateY =
        Math.abs(curveValue) > 50 ? `translateY(${rotation * 0.15}px)` : "";

      // Style for this character
      const charStyle = {
        display: "inline-block",
        transform: `perspective(500px) ${transform} ${translateY}`,
        transformOrigin: safeValue > 0 ? "bottom center" : "top center",
        transition: "transform 0.3s ease-out",
      };

      return (
        <span key={index} style={charStyle}>
          {char}
        </span>
      );
    });
  }, [text, curveValue]);

  return (
    <div
      className={`curved-text-container ${className}`}
      style={{
        display: "inline-block",
        textAlign: "center",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {charElements}
    </div>
  );
};

export default CurvedText;
