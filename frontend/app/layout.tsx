"use client";

import "@/app/ui/globals.css";
import { inter } from "./ui/fonts";
import Nav from "./ui/Nav";
import { Providers } from "./providers";
import { SessionProvider } from "next-auth/react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <Providers>
            <div className="flex flex-col h-screen max-h-screen">
              <Nav />
              <div className="flex-grow overflow-y-auto">{children}</div>
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
