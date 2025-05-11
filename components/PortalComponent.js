import { createPortal } from "react-dom";
import { useEffect, useState, memo } from "react";

const PortalComponent = memo(function PortalComponent({ children }) {
  const [portalNode, setPortalNode] = useState(null);

  useEffect(() => {
    // Look for existing portal container
    let portalRoot = document.getElementById("handler-portal");
    
    if (portalRoot) {
      setPortalNode(portalRoot);
    } else {
      console.error("Portal container with id 'handler-portal' not found");
    }
  }, []);

  if (!portalNode) return null;

  return createPortal(children, portalNode);
});

export default PortalComponent;