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
    "Dancing Script": ['"Brush Script MT"', '"Comic Sans MS"', "cursive"],
    Pacifico: ["cursive"],
    "Playfair Display": ['"Georgia"', '"Times New Roman"', "serif"],
    Roboto: ['"Helvetica Neue"', "Arial", "sans-serif"],
    "Open Sans": ['"Helvetica Neue"', "Arial", "sans-serif"],
    Montserrat: ["Arial", "sans-serif"],
    "Courier New": ['"Lucida Console"', "monospace"],
    // Add more mappings as needed
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

export function getCurvedTextHTML(text = "", radius = 120) {
  if (!text) return false;

  const characters = text.split("");
  const degree = 180 / characters.length;

  const html = characters
    .map((char, i) => {
      const rotate = i * degree - (degree * characters.length) / 2;
      return `<span style="
        position: absolute;
        height: ${radius}px;
        transform: rotate(${rotate}deg);
        transform-origin: bottom center;
        left: 50%;
        bottom: 0;
        white-space: pre;
      ">${char}</span>`;
    })
    .join("");

  return `<div style="position: relative; height: ${radius}px; width: ${
    radius * 2
  }px;">${html}</div>`;
}
