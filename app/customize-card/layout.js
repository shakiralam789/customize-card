import CcProvider from "@/context/ccProvider";

export default function Layout({ children }) {
  return <CcProvider>{children}</CcProvider>;
}
