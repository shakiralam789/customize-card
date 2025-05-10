import ReactDOM from "react-dom";

export default function PortalComponent({ children }) {
  const portalRoot = document.getElementById("handler-portal");
  return ReactDOM.createPortal(children, portalRoot);
}
