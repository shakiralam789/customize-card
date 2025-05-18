"use client";
import React, { useRef, useEffect, useState } from 'react';

/**
 * Measures the bounding rect of an element
 * @param {HTMLElement} element - The element to measure
 * @returns {Object} The measured dimensions
 */
const measureElement = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    height: rect.height,
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width
  };
};

/**
 * Splits text into individual letter spans
 * @param {string} text - The text to split
 * @returns {Array} Array of letter spans
 */
const createLetterElements = (text) => {
  const letters = text.trim().split('');
  return letters.map((letter, index) => {
    const content = letter === ' ' ? '\u00A0' : letter;
    return <span key={index} className="circle-letter">{content}</span>;
  });
};

/**
 * Converts degrees to radians
 * @param {number} deg - Angle in degrees
 * @returns {number} Angle in radians
 */
const toRadians = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Converts radians to degrees
 * @param {number} rad - Angle in radians
 * @returns {number} Angle in degrees
 */
const toDegrees = (rad) => {
  return rad * (180 / Math.PI);
};

/**
 * Calculates angle for a letter based on its width and the radius
 * @param {number} width - Letter width
 * @param {number} radius - Circle radius
 * @returns {number} Angle in degrees
 */
const calcLetterAngle = (width, radius) => {
  return toDegrees(width / radius);
};

/**
 * Calculates the height of a circular arc
 * @param {number} radius - Circle radius
 * @param {number} angle - Angle in degrees
 * @returns {number} Arc height
 */
const calcArcHeight = (radius, angle) => {
  return radius * (1 - Math.cos(toRadians(angle / 2)));
};

/**
 * Calculates the width of a circular arc
 * @param {number} radius - Circle radius
 * @param {number} angle - Angle in degrees
 * @returns {number} Arc width
 */
const calcArcWidth = (radius, angle) => {
  return 2 * radius * Math.sin(toRadians(angle / 2));
};

/**
 * Calculates rotations for each letter
 * @param {Array} metrics - Array of letter metrics
 * @param {number} radius - Circle radius
 * @returns {Object} Total angle and rotation angles for each letter
 */
const calcLetterRotations = (metrics, radius) => {
  return metrics.reduce((result, metric) => {
    const width = metric.width;
    const angle = calcLetterAngle(width, radius);
    
    return {
      θ: result.θ + angle,
      rotations: [...result.rotations, result.θ + angle / 2]
    };
  }, { θ: 0, rotations: [] });
};

/**
 * CircleType component for curved text
 * @param {Object} props - Component props
 * @param {string} props.text - Text to curve
 * @param {number} props.radiusPercent - Radius as a percentage (negative curves up, positive curves down, 100 is full round)
 * @param {boolean} props.initialForceWidth - Whether to force container width
 * @param {boolean} props.initialForceHeight - Whether to force container height
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional inline styles
 */
const CircleType = ({ 
  text,
  radiusPercent = 0,
  initialForceWidth = false,
  initialForceHeight = true,
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  
  // State for configuration
  const [forceWidth, setForceWidth] = useState(initialForceWidth);
  const [forceHeight, setForceHeight] = useState(initialForceHeight);
  const [metrics, setMetrics] = useState([]);
  const [fontSize, setFontSize] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [minRadius, setMinRadius] = useState(0);
  const [totalTextWidth, setTotalTextWidth] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [naturalLetterSpacing, setNaturalLetterSpacing] = useState(0);
  
  // Initialize metrics and sizing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const computedStyle = window.getComputedStyle(containerRef.current);
    const fontSize = parseFloat(computedStyle.fontSize);
    const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize;
    
    setFontSize(fontSize);
    setLineHeight(lineHeight);
    
    // Wait for letters to be rendered
    setTimeout(() => {
      if (!lettersRef.current || lettersRef.current.length === 0) return;
      
      // Measure each letter
      const letterMetrics = lettersRef.current.map(element => {
        if (!element) return { width: 0, height: 0 };
        return measureElement(element);
      });
      
      setMetrics(letterMetrics);
      
      // Calculate total text width
      const totalWidth = letterMetrics.reduce((sum, metric) => sum + metric.width, 0);
      setTotalTextWidth(totalWidth);
      
      // Calculate minimum radius based on total width
      const minRadius = totalWidth / Math.PI / 2 + lineHeight;
      setMinRadius(minRadius);
      
      // Capture natural letter spacing by measuring container width
      // vs sum of individual letter widths
      const containerWidth = measureElement(containerRef.current).width;
      const rawLetterWidthSum = letterMetrics.reduce((sum, metric) => sum + metric.width, 0);
      const spacingDifference = containerWidth - rawLetterWidthSum;
      
      // Average space per letter gap (n letters have n-1 gaps)
      const avgLetterSpacing = letterMetrics.length > 1 ? 
        spacingDifference / (letterMetrics.length - 1) : 0;
      
      setNaturalLetterSpacing(avgLetterSpacing);
      
      setInitialized(true);
    }, 0);
  }, [text]);
  
  // Update layout when configuration changes
  useEffect(() => {
    if (!initialized || metrics.length === 0 || !containerRef.current) return;
    
    updateLayout();
  }, [radiusPercent, forceWidth, forceHeight, metrics, initialized]);
  
  // Convert radiusPercent to actual radius and direction
  const getRadiusAndDirection = () => {
  // Get absolute percentage value
  const absPercent = Math.abs(radiusPercent);
  
  // Direction is based on sign of radiusPercent
  // Negative = curve up, Positive = curve down
  const direction = radiusPercent < 0 ? -1 : 1;
  
  let effectiveRadius;
  
  if (absPercent === 0) {
    // For 0%, use a very large radius to make text nearly straight
    effectiveRadius = 9999999;
  } else {
    // For a proper circular text, the circumference should be:
    // totalTextWidth * (100 / absPercent)
    
    // Calculate circumference needed for text at given percentage
    // For 100%, circumference = totalTextWidth (full circle)
    // For 50%, circumference = totalTextWidth * 2 (half circle)
    const circumference = totalTextWidth * (100 / absPercent);
    
    // Get radius from circumference: r = C / (2π)
    effectiveRadius = circumference / (2 * Math.PI);
    
    // Ensure radius is not smaller than minimum
    effectiveRadius = Math.max(minRadius, effectiveRadius);
  }
  
  return { radius: effectiveRadius, direction };
};
  
  // Layout calculation and application
  const updateLayout = () => {
    const { radius, direction } = getRadiusAndDirection();
    
    // FIX #2: Handle the zero case with consistent letter spacing
    // If radius percentage is exactly 0, reset to flat text but maintain spacing
    if (radiusPercent === 0) {
      // Reset transforms but maintain natural letter spacing
      lettersRef.current.forEach((element) => {
        if (!element) return;
        element.style.position = '';
        element.style.bottom = '';
        element.style.left = '';
        element.style.transform = '';
        element.style.transformOrigin = '';
        element.style.letterSpacing = '';
        element.style.display = '';
      });
      
      // Reset container dimensions
      containerRef.current.style.height = '';
      containerRef.current.style.width = '';
      return;
    }
    
    // For very small percentages (near zero), use a transitional approach
    // to avoid the sharp change in letter spacing
    const isNearZero = Math.abs(radiusPercent) < 0.5;
    
    // Handle normal curved text (non-zero percentage)
    const effectiveRadius = radius;
    const baseRadius = direction === -1 ? -effectiveRadius + lineHeight : effectiveRadius;
    const originY = baseRadius / fontSize;
    const transformOrigin = `center ${originY}em`;
    
    // For the inner circle calculations, consider letter spacing
    const innerRadius = effectiveRadius - lineHeight;
    
    // Update metrics with natural spacing for rotation calculations
    const spacedMetrics = metrics.map((metric, i) => {
      // Include natural letter spacing in width calculations
      // Only add spacing between letters (not after the last letter)
      const additionalWidth = i < metrics.length - 1 ? naturalLetterSpacing : 0;
      return {
        ...metric,
        width: metric.width + additionalWidth
      };
    });
    
    const { rotations, θ: totalAngle } = calcLetterRotations(spacedMetrics, innerRadius);
    
    // Position each letter
    lettersRef.current.forEach((element, i) => {
      if (!element) return;
      
      if (isNearZero) {
        // Transitional approach for near-zero percentages
        // Blend between flat and curved
        const blendFactor = Math.abs(radiusPercent) / 0.5; // 0 to 1
        
        // Calculate a smaller rotation for smooth transition
        const rotation = (-0.5 * totalAngle + rotations[i]) * direction * blendFactor;
        
        // Use inline-block but with transformed positions for smoother transition
        element.style.position = 'relative';
        element.style.display = 'inline-block';
        element.style.transform = `rotate(${rotation}deg)`;
        element.style.transformOrigin = 'center center';
      } else {
        // Normal curved text positioning
        const rotation = (-0.5 * totalAngle + rotations[i]) * direction;
        const xOffset = -0.5 * metrics[i].width / fontSize;
        
        const transform = `translateX(${xOffset}em) rotate(${rotation}deg)`;
        
        element.style.position = 'absolute';
        element.style.bottom = direction === -1 ? '0' : 'auto';
        element.style.left = '50%';
        element.style.transform = transform;
        element.style.transformOrigin = transformOrigin;
      }
    });
    
    // Adjust container height if needed
    if (forceHeight) {
      let height;
      if (totalAngle > 180) {
        height = calcArcHeight(effectiveRadius, totalAngle);
      } else {
        height = calcArcHeight(innerRadius, totalAngle) + lineHeight;
      }
      
      containerRef.current.style.height = `${height / fontSize}em`;
    }
    
    // Adjust container width if needed
    if (forceWidth) {
      const width = calcArcWidth(effectiveRadius, Math.min(180, totalAngle));
      containerRef.current.style.width = `${width / fontSize}em`;
    }
  };
  
  // Create letter elements
  const letterElements = createLetterElements(text);
  
  return (
    <div 
      ref={containerRef} 
      className={`circle-type ${className}`} 
      style={{ position: 'relative', ...style }}
      aria-label={text}
    >
      {letterElements.map((letter, index) => (
        React.cloneElement(letter, {
          ref: (el) => {
            lettersRef.current[index] = el;
          }
        })
      ))}
    </div>
  );
};

export default CircleType;