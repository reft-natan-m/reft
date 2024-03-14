import "@/app/ui/globals.css";
import { inter } from "./ui/fonts";
import Nav from "./ui/Nav";
import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen max-h-screen">
          <Nav />
          <div className="flex-grow overflow-y-auto bg-primary text-default-text">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
