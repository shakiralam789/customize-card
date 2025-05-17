import { useEffect, useState, useRef } from "react";
import CircleType from "circletype";

const useCurvedText = (text, curvePercent, elementRef) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isValidText, setIsValidText] = useState(true);
  const circleTypeInstance = useRef(null);

  useEffect(() => {
    if (!elementRef || !elementRef.current || !text || curvePercent == 0)
      return;

    // Check if text contains newlines or is empty
    const containsNewline = text.includes("\n");
    const isEmpty = text.trim() === "";

    if (containsNewline || isEmpty) {
      setIsValidText(false);
      setDimensions({ width: 0, height: 0 });

      // Clean up any existing instance
      if (circleTypeInstance.current) {
        circleTypeInstance.current.destroy();
        circleTypeInstance.current = null;
      }

      return;
    } else {
      setIsValidText(true);
    }

    // If curve percent is 0, handle flat text case
    if (curvePercent === 0) {
      // Clean up any existing instance
      if (circleTypeInstance.current) {
        circleTypeInstance.current.destroy();
        circleTypeInstance.current = null;
      }

      // For flat text, measure the element directly
      const rect = elementRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
      return;
    }

    // Clean up previous instance
    if (circleTypeInstance.current) {
      circleTypeInstance.current.destroy();
      circleTypeInstance.current = null;
    }

    // Calculate radius: 0% = flat (infinite radius), ±100% = tightest (radius = 50)
    const radius = 1000 - (Math.abs(curvePercent) / 100) * 950;

    // Direction: positive values curve upward (like a smile), negative values curve downward (like a frown)
    const isDownward = curvePercent < 0;

    // Create new instance
    circleTypeInstance.current = new CircleType(elementRef.current);

    // Update radius and direction
    circleTypeInstance.current.radius(radius).dir(isDownward ? -1 : 1);

    // Wait for CircleType to finish rendering
    setTimeout(() => {
      if (!elementRef.current) return;

      // Calculate dimensions
      let width = 0;
      let height = 0;

      if (elementRef.current.children.length > 0) {
        const spans = elementRef.current.querySelectorAll("span");

        // Find leftmost and rightmost spans to calculate true width
        let minLeft = Infinity;
        let maxRight = -Infinity;

        spans.forEach((span) => {
          const rect = span.getBoundingClientRect();
          minLeft = Math.min(minLeft, rect.left);
          maxRight = Math.max(maxRight, rect.right);
        });

        if (minLeft !== Infinity && maxRight !== -Infinity) {
          width = maxRight - minLeft;
        } else {
          width = elementRef.current.children[0].getBoundingClientRect().width;
        }

        // Get height from the parent element
        height = elementRef.current.getBoundingClientRect().height;
      } else {
        // Fallback to regular measurements
        const rect = elementRef.current.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }

      setDimensions({
        width: Math.round(width),
        height: Math.round(height),
      });
    }, 10);

    // Cleanup function
    return () => {
      if (circleTypeInstance.current) {
        circleTypeInstance.current.destroy();
        circleTypeInstance.current = null;
      }
    };
  }, [text, curvePercent, elementRef]);

  return {
    dimensions,
    circleTypeInstance: circleTypeInstance.current,
    isDownward: curvePercent < 0,
    radius:
      curvePercent === 0
        ? Infinity
        : 1000 - (Math.abs(curvePercent) / 100) * 950,
    isValidText,
  };
};

export default useCurvedText;
