import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata = {
  title: "Customize card",
  description: "Customize card",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader
          color="#5E35CC"
          height={3}
          speed={500}
          showSpinner={false}
        />
        {children}
      </body>
    </html>
  );
}
