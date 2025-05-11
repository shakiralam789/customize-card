import { createPortal } from "react-dom";
import { useEffect, useRef, memo } from "react";

const PortalComponent = memo(function PortalComponent({ children }) {
  const portalNodeRef = useRef(null);

  useEffect(() => {
    let portalRoot = document.getElementById("handler-portal");
    let createdNewPortal = false;

    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "handler-portal";
      document.body.appendChild(portalRoot);
      createdNewPortal = true;
    }

    portalNodeRef.current = portalRoot;

    return () => {
      if (createdNewPortal && portalRoot && portalRoot.parentNode) {
        try {
          portalRoot.parentNode.removeChild(portalRoot);
        } catch (e) {
          console.warn("Failed to remove portal node:", e);
        }
      }
    };
  }, []);

  if (!portalNodeRef.current) return null;

  return createPortal(children, portalNodeRef.current);
});

export default PortalComponent;
