
import CircleType from "circletype";

export function applyCurvedText(element, text, curvePercent) {
  if (!element || typeof text !== 'string') {
    return { 
      width: 0, 
      height: 0, 
      isValid: false,
      getMeasurements: () => ({ width: 0, height: 0, isValid: false })
    };
  }

  if (element._circleTypeInstance) {
    element._circleTypeInstance.destroy();
    element._circleTypeInstance = null;
  }

  element.textContent = text;

  if (curvePercent === 0) {
    const rect = element.getBoundingClientRect();
    return { 
      width: Math.round(rect.width), 
      height: Math.round(rect.height),
      isValid: true,
      getMeasurements: () => ({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        isValid: true
      })
    };
  }

  try {
    const radius = 1000 - (Math.abs(curvePercent) / 100) * 950;
    const isDownward = curvePercent < 0;
    
    // Apply CircleType
    element._circleTypeInstance = new CircleType(element);
    element._circleTypeInstance.radius(radius).dir(isDownward ? -1 : 1);
    
    // Initial measurements (will be incomplete)
    let initialWidth = element.getBoundingClientRect().width;
    let initialHeight = element.getBoundingClientRect().height;
    
    // Return both the initial measurements and a function to get final measurements
    return {
      width: Math.round(initialWidth),
      height: Math.round(initialHeight),
      isValid: true,
      getMeasurements: () => {
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            // Calculate final dimensions using the same logic
            let width = 0;
            let height = 0;
            
            if (element.children.length > 0) {
              const spans = element.querySelectorAll('span');
              
              let minLeft = Infinity;
              let maxRight = -Infinity;
              
              spans.forEach(span => {
                const rect = span.getBoundingClientRect();
                minLeft = Math.min(minLeft, rect.left);
                maxRight = Math.max(maxRight, rect.right);
              });
              
              if (minLeft !== Infinity && maxRight !== -Infinity) {
                width = maxRight - minLeft;
              } else {
                width = element.getBoundingClientRect().width;
              }
              
              height = element.getBoundingClientRect().height;
            } else {
              const rect = element.getBoundingClientRect();
              width = rect.width;
              height = rect.height;
            }

            resolve({
              width: Math.round(width),
              height: Math.round(height),
              isValid: true
            });
          });
        });
      }
    };
  } catch (error) {
    
    const rect = element.getBoundingClientRect();
      
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      isValid: false,
      error: error.message,
      getMeasurements: () => ({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        isValid: false,
        error: error.message
      })
    };
  }
}

export function cleanupCurvedText(element) {
  if (element && element._circleTypeInstance) {
    element._circleTypeInstance.destroy();
    element._circleTypeInstance = null;
  }
}

export function measureCurvedText(text, curvePercent, styleProps = {}) {
  // Create a temporary element
  const tempElement = document.createElement('div');
  
  // Style the element
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  tempElement.style.whiteSpace = 'nowrap';
  tempElement.style.display = 'inline-block';
  
  // Apply provided styles
  Object.keys(styleProps).forEach(key => {
    tempElement.style[key] = styleProps[key];
  });
  
  // Add to DOM temporarily
  document.body.appendChild(tempElement);
  
  // Apply curved text and get dimensions
  const result = applyCurvedText(tempElement, text, curvePercent);
  
  // Clean up
  cleanupCurvedText(tempElement);
  document.body.removeChild(tempElement);
  
  return result;
}

export function getWidthAndAspectRatio(element) {
  if (!element) {
    return {
      width: null,
      height: null,
      ratio: null,
    };
  }

  let width = element.scrollWidth;
  let height = element.clientHeight;
  let ratio = width / height;

  return {
    width,
    height,
    ratio,
  };
}

export function tlRotation(rotate) {
  let dir = "tl";

  if (!rotate) return;

  if (rotate > 315 || rotate < 45) {
    dir = "tl";
  } else if (rotate > 45 && rotate < 135) {
    dir = "tr";
  } else if (rotate > 135 && rotate < 225) {
    dir = "br";
  } else if (rotate > 225 && rotate < 315) {
    dir = "bl";
  }
  return dir;
}

export function trRotation(rotate) {
  let dir = "tr";

  if (!rotate) return;

  if (rotate > 315 || rotate < 45) {
    dir = "tr";
  } else if (rotate > 45 && rotate < 135) {
    dir = "br";
  } else if (rotate > 135 && rotate < 225) {
    dir = "bl";
  } else if (rotate > 225 && rotate < 315) {
    dir = "tl";
  }

  return dir;
}

export function blRotation(rotate) {
  let dir = "bl";

  if (!rotate) return;

  if (rotate > 315 || rotate < 45) {
    dir = "bl";
  } else if (rotate > 45 && rotate < 135) {
    dir = "tl";
  } else if (rotate > 135 && rotate < 225) {
    dir = "tr";
  } else if (rotate > 225 && rotate < 315) {
    dir = "br";
  }
  return dir;
}

export function brRotation(rotate) {
  let dir = "br";

  if (!rotate) return;

  if (rotate > 315 || rotate < 45) {
    dir = "br";
  } else if (rotate > 45 && rotate < 135) {
    dir = "bl";
  } else if (rotate > 135 && rotate < 225) {
    dir = "tl";
  } else if (rotate > 225 && rotate < 315) {
    dir = "tr";
  }
  return dir;
}

export function getFontFamily(font) {
  const fallbackMap = {
    // System fonts with appropriate fallbacks
    Arial: ["Helvetica", "sans-serif"],
    "Courier New": ["Courier", "monospace"],
    Georgia: ["Times", "serif"],
    "Times New Roman": ["Times", "serif"],
    Verdana: ["Geneva", "sans-serif"],
    "Trebuchet MS": ["Helvetica", "sans-serif"],
    Tahoma: ["Geneva", "sans-serif"],
    "Lucida Console": ["Monaco", "monospace"],
    Impact: ["Charcoal", "sans-serif"],
    "Palatino Linotype": ["Book Antiqua", "Palatino", "serif"],
    "Segoe UI": ["Helvetica", "Arial", "sans-serif"],

    // Decorative fonts with appropriate fallbacks
    "Dancing Script": ["cursive"],
    "Great Vibes": ["cursive"],
    Pacifico: ["cursive"],
    Satisfy: ["cursive"],
    Parisienne: ["cursive"],
    "Alex Brush": ["cursive"],
    Allura: ["cursive"],
    Sacramento: ["cursive"],
    "Marck Script": ["cursive"],
    Cookie: ["cursive"],
    "Herr Von Muellerhoff": ["cursive"],
    Tangerine: ["cursive"],
    "Cormorant Garamond": ["Georgia", "serif"],
    "Playfair Display": ["Georgia", "Times New Roman", "serif"],
    Cinzel: ["Times New Roman", "serif"],
  };

  const fallbacks = fallbackMap[font] || ["sans-serif"];
  return [`"${font}"`, ...fallbacks].join(", ");
}

export function addToLocalStorage({ id, allItems, frame }) {
  if (!allItems || !frame) {
    return;
  }
  let formatData = {
    id: id,
    data: {
      items: allItems || [],
      frame: frame || {},
    },
  };
  localStorage.setItem(
    `customize-card-data${id || ""}`,
    JSON.stringify(formatData)
  );
}

export function removeLocalStorage(id) {
  localStorage.removeItem(`customize-card-data${id || ""}`);
}

export function managePosition(
  { idol, follower, parent, scrollParent, item },
  withAction = true
) {
  if (!idol || !parent) return;
  // const rotate = item?.rotate || 0;

  const targetWidth = idol.offsetWidth;
  const targetHeight = idol.offsetHeight;

  let prevWidth = item.width;
  let prevHeight = item.height;

  let dx = targetWidth - prevWidth;
  let dy = targetHeight - prevHeight;

  let targetLeft = item?.position?.x;
  let targetTop = item?.position?.y;

  if (item.textAlign == "center") {
    targetLeft = targetLeft - dx / 2;
    targetTop = targetTop - dy / 2;
  } else if (item?.textAlign == "right") {
    targetLeft = targetLeft - dx;
    targetTop = targetTop - dy;
  }

  if (scrollParent) {
    scrollParent.scrollLeft = 0;
    scrollParent.scrollTop = 0;
  }

  if (follower && withAction) {
    follower.style.width = `${targetWidth}px`;
    follower.style.height = `${targetHeight}px`;
    follower.style.left = `${targetLeft}px`;
    // follower.style.top = `${targetTop}px`;

    if (idol) {
      idol.parentElement.style.left = `${targetLeft}px`;
      // idol.parentElement.style.top = `${targetTop}px`;
    }
  }

  return {
    width: targetWidth,
    height: targetHeight,
    left: targetLeft,
    top: targetTop,
    // rotate: rotate,
  };
}

export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;

    img.src = URL.createObjectURL(file);
  });
}

export function findSnapPoints({
  draggedElement,
  newX,
  newY,
  elements,
  canvasWidth = 400,
  canvasHeight = 550,
}) {
  const result = {
    horizontal: null,
    vertical: null,
  };

  // Calculate center points
  const draggedCenterX = newX + draggedElement.width / 2;
  const draggedCenterY = newY + draggedElement.height / 2;

  // Calculate edge points
  const draggedRight = newX + draggedElement.width;
  const draggedBottom = newY + draggedElement.height;

  // Check for alignment with other elements
  elements.forEach((el) => {
    if (el.id === draggedElement.id) return; // Skip self

    // Calculate target element's reference points
    const targetCenterX = el.x + el.width / 2;
    const targetCenterY = el.y + el.height / 2;
    const targetRight = el.x + el.width;
    const targetBottom = el.y + el.height;

    // Horizontal alignment checks

    // Left edge alignment
    if (Math.abs(newX - el.x) < SNAP_THRESHOLD) {
      result.horizontal = { snapPosition: el.x, type: "left" };
    }
    // Right edge alignment
    else if (Math.abs(draggedRight - targetRight) < SNAP_THRESHOLD) {
      result.horizontal = {
        snapPosition: targetRight - draggedElement.width,
        type: "right",
      };
    }
    // Center alignment
    else if (Math.abs(draggedCenterX - targetCenterX) < SNAP_THRESHOLD) {
      result.horizontal = {
        snapPosition: targetCenterX - draggedElement.width / 2,
        type: "center",
      };
    }
    // Left to right alignment
    else if (Math.abs(newX - targetRight) < SNAP_THRESHOLD) {
      result.horizontal = { snapPosition: targetRight, type: "edge" };
    }
    // Right to left alignment
    else if (Math.abs(draggedRight - el.x) < SNAP_THRESHOLD) {
      result.horizontal = {
        snapPosition: el.x - draggedElement.width,
        type: "edge",
      };
    }

    // Vertical alignment checks

    // Top edge alignment
    if (Math.abs(newY - el.y) < SNAP_THRESHOLD) {
      result.vertical = { snapPosition: el.y, type: "top" };
    }
    // Bottom edge alignment
    else if (Math.abs(draggedBottom - targetBottom) < SNAP_THRESHOLD) {
      result.vertical = {
        snapPosition: targetBottom - draggedElement.height,
        type: "bottom",
      };
    }
    // Center alignment
    else if (Math.abs(draggedCenterY - targetCenterY) < SNAP_THRESHOLD) {
      result.vertical = {
        snapPosition: targetCenterY - draggedElement.height / 2,
        type: "center",
      };
    }
    // Top to bottom alignment
    else if (Math.abs(newY - targetBottom) < SNAP_THRESHOLD) {
      result.vertical = { snapPosition: targetBottom, type: "edge" };
    }
    // Bottom to top alignment
    else if (Math.abs(draggedBottom - el.y) < SNAP_THRESHOLD) {
      result.vertical = {
        snapPosition: el.y - draggedElement.height,
        type: "edge",
      };
    }
  });

  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  // Canvas horizontal alignments
  if (Math.abs(newX) < SNAP_THRESHOLD) {
    result.horizontal = { snapPosition: 0, type: "canvas-left" };
  } else if (Math.abs(draggedRight - canvasWidth) < SNAP_THRESHOLD) {
    result.horizontal = {
      snapPosition: canvasWidth - draggedElement.width,
      type: "canvas-right",
    };
  } else if (Math.abs(draggedCenterX - canvasCenterX) < SNAP_THRESHOLD) {
    result.horizontal = {
      snapPosition: canvasCenterX - draggedElement.width / 2,
      type: "canvas-center",
    };
  }

  // Canvas vertical alignments
  if (Math.abs(newY) < SNAP_THRESHOLD) {
    result.vertical = { snapPosition: 0, type: "canvas-top" };
  } else if (Math.abs(draggedBottom - canvasHeight) < SNAP_THRESHOLD) {
    result.vertical = {
      snapPosition: canvasHeight - draggedElement.height,
      type: "canvas-bottom",
    };
  } else if (Math.abs(draggedCenterY - canvasCenterY) < SNAP_THRESHOLD) {
    result.vertical = {
      snapPosition: canvasCenterY - draggedElement.height / 2,
      type: "canvas-center",
    };
  }

  return result;
}

export function formatNumberWithMaxDecimals(text, maxDecimals = 3) {
  if (!text) return text;

  return text.replace(/\d+\.\d+/g, (match) => {
    const num = parseFloat(match);
    if (!isNaN(num) && match.includes(".")) {
      const formatted = num.toString();
      const parts = formatted.split(".");
      if (parts.length === 2 && parts[1].length > maxDecimals) {
        return `${parts[0]}.${parts[1].substring(0, maxDecimals)}`;
      }
    }
    return match;
  });
}

export function limitDecimalPlaces(value) {
  if (value === "" || value === null || value === undefined) return value;

  const parsed = parseFloat(value);
  if (isNaN(parsed)) return value;

  return Math.round(parsed * 1000) / 1000;
}
