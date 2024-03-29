import "@/app/ui/globals.css";
import { inter } from "./ui/fonts";
import Nav from "./ui/Nav";
import { Providers } from "./providers";
import ContextProvider from "./context/Provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ContextProvider session={undefined}>
        <body className={inter.className}>
          <Providers>
            <div className="flex flex-col h-screen max-h-screen">
              <Nav />
              <div className="flex-grow overflow-y-auto">{children}</div>
            </div>
          </Providers>
        </body>
      </ContextProvider>
    </html>
  );
}
