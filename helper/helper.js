export function curvedText({
  text = "Curved Text Example",
  curveValue = 0,
  style = {},
  className = "",
}) {
  // Ensure curveValue is within -100 to 100 range
  const safeValue = Math.max(-100, Math.min(100, curveValue));

  // Split text into individual characters
  const chars = text.split("");

  // Calculate the arc angle based on the curve value
  // At 100%, we want a full semicircle (180 degrees)
  const totalArcAngle = (safeValue / 100) * 180;

  // Radius calculation - increase with higher curve values for better effect
  const baseRadius = 100; // Base radius in pixels
  const radiusMultiplier = Math.max(1, Math.abs(safeValue) / 25); // Increase radius with curve intensity
  const radius = baseRadius * radiusMultiplier;

  // Calculate the angle step between each character
  const angleStep = chars.length > 1 ? totalArcAngle / (chars.length - 1) : 0;

  // Process each character and create HTML for it
  let charElementsHTML = "";

  // Calculate the container height to accommodate the curve
  const containerHeight =
    Math.abs(safeValue) > 20 ? `${Math.abs(safeValue) * 1.5}px` : "auto";

  chars.forEach((char, index) => {
    // Skip spaces, add a non-breaking space instead
    if (char === " ") {
      charElementsHTML += "&nbsp;";
      return;
    }

    // Calculate angle for this character
    // For center-aligned text, start from -totalArcAngle/2 to totalArcAngle/2
    const startAngle = -totalArcAngle / 2;
    const charAngle = startAngle + index * angleStep;

    // Convert angle to radians for math calculations
    const charAngleRad = (charAngle * Math.PI) / 180;

    // Calculate position based on polar coordinates
    // For a circle/arc, we use sin and cos functions
    const yOffset =
      safeValue >= 0
        ? -Math.sin(charAngleRad) * radius // Curve upward
        : Math.sin(charAngleRad) * radius; // Curve downward

    const xOffset = Math.cos(charAngleRad) * radius - radius;

    // Calculate rotation for this character (tangent to the curve)
    const charRotation = safeValue >= 0 ? charAngle : -charAngle;

    // Style for this character - apply both position and rotation
    const charStyle = `
        display: inline-block;
        position: absolute;
        transform-origin: center;
        transform: translate(${xOffset}px, ${yOffset}px) rotate(${charRotation}deg);
        transition: transform 0.3s ease-out;
      `;

    // Add this character with its style to the HTML
    charElementsHTML += `<span style="${charStyle}">${char}</span>`;
  });

  // Process any additional styles passed in
  let additionalStyles = "";
  if (style) {
    // Convert style object to CSS string
    for (const property in style) {
      // Convert camelCase to kebab-case for CSS
      const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();
      additionalStyles += `${cssProperty}: ${style[property]}; `;
    }
  }

  // Build the container with all the character spans
  // Position relative to allow absolute positioning of characters
  const containerHTML = `
      <div class="curved-text-container ${className || ""}" 
           style="display: inline-block; position: relative; height: ${containerHeight}; min-width: 100%; text-align: center; ${additionalStyles}">
        ${charElementsHTML}
      </div>
    `;

  return containerHTML;
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
    "Arial": ["Helvetica", "sans-serif"],
    "Courier New": ["Courier", "monospace"],
    "Georgia": ["Times", "serif"],
    "Times New Roman": ["Times", "serif"],
    "Verdana": ["Geneva", "sans-serif"],
    "Trebuchet MS": ["Helvetica", "sans-serif"],
    "Tahoma": ["Geneva", "sans-serif"],
    "Lucida Console": ["Monaco", "monospace"],
    "Impact": ["Charcoal", "sans-serif"],
    "Palatino Linotype": ["Book Antiqua", "Palatino", "serif"],
    "Segoe UI": ["Helvetica", "Arial", "sans-serif"],
    
    // Decorative fonts with appropriate fallbacks
    "Dancing Script": ["cursive"],
    "Great Vibes": ["cursive"],
    "Pacifico": ["cursive"],
    "Satisfy": ["cursive"],
    "Parisienne": ["cursive"],
    "Alex Brush": ["cursive"],
    "Allura": ["cursive"],
    "Sacramento": ["cursive"],
    "Marck Script": ["cursive"],
    "Cookie": ["cursive"],
    "Herr Von Muellerhoff": ["cursive"],
    "Tangerine": ["cursive"],
    "Cormorant Garamond": ["Georgia", "serif"],
    "Playfair Display": ["Georgia", "Times New Roman", "serif"],
    "Cinzel": ["Times New Roman", "serif"],
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

export function getCurvedTextHTML(text = "", curve = 0) {
  if (!text) return "";
  if (curve === 0) return `${text}`;

  curve = Math.max(-100, Math.min(100, curve));

  const characters = text.split("");
  const fontSize = 16;
  const charWidth = fontSize * 0.6;
  const arcLength = characters.length * charWidth;

  const totalAngle = (360 * Math.abs(curve)) / 100;
  const radius = arcLength / ((Math.PI * totalAngle) / 180);
  const diameter = Math.ceil(radius * 2);
  const isCurvingDown = curve > 0;

  const startAngle = -totalAngle / 2;
  const anglePerPixel = totalAngle / arcLength;
  let currentAngle = startAngle;

  const html = characters
    .map((char) => {
      const rotate = currentAngle;
      const transform = `
        rotate(${rotate}deg)
        translateY(${isCurvingDown ? -radius : radius}px)
        rotate(${-rotate}deg)
      `;
      currentAngle += anglePerPixel * charWidth;

      return `<span style="
        position: absolute;
        left: 50%;
        top: 50%;
        transform-origin: center;
        transform: ${transform};
        white-space: pre;
      ">${char}</span>`;
    })
    .join("");

  return `
    <div style="
      width: ${diameter}px;
      height: ${diameter / (100 / Math.abs(curve))}px;
      position: relative;
    ">
      <div style="
        translateY: ${isCurvingDown ? -radius : radius}px;
      ">
        ${html}
      </div>
    </div>
  `;
}

export function managePosition(
  { idol, follower, parent, scrollParent },
  withAction = true
) {
  if (!idol || !parent) return;

  const idolRect = idol.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const targetWidth = idol.offsetWidth;
  const targetHeight = idol.offsetHeight;

  const centerX = idolRect.left + idolRect.width / 2;
  const centerY = idolRect.top + idolRect.height / 2;

  const parentLeft = parentRect.left;
  const parentTop = parentRect.top;

  const targetLeft = centerX - parentLeft - targetWidth / 2;
  const targetTop = centerY - parentTop - targetHeight / 2;

  if (scrollParent) {
    requestAnimationFrame(() => {
      scrollParent.scrollLeft = 0;
      scrollParent.scrollTop = 0;
    });
  }

  if (follower && withAction) {
    follower.style.width = `${targetWidth}px`;
    follower.style.height = `${targetHeight}px`;
    follower.style.left = `${targetLeft}px`;
    follower.style.top = `${targetTop}px`;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    left: targetLeft,
    top: targetTop,
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
