import "@/app/ui/globals.css";
import { inter } from "./ui/fonts";
import Nav from "./ui/Nav";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col h-screen max-h-screen">
            <Nav />
            <div className="flex-grow overflow-y-auto">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
