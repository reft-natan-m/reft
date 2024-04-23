"use client";

import "@/app/ui/globals.css";
import { inter } from "./ui/fonts";
import Nav from "./ui/Nav";
import { Providers } from "./providers";
import { SessionProvider } from "next-auth/react";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  Chain
} from "wagmi/chains";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";

const hardhatChain: Chain = {
  id: 31337,
  name: 'Hardhat',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    }
  },
  testnet: true,
  nativeCurrency: {
    name: "ethereum",
    symbol: "ETH",
    decimals: 2
  },
};

const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "82b8a5ff24a258c07493943c98fe8881",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    hardhatChain,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
              <RainbowKitProvider theme={darkTheme()}>
                <Providers>
                  <div className="flex flex-col h-screen max-h-screen">
                    <Nav />
                    <div className="flex-grow overflow-y-auto">{children}</div>
                  </div>
                </Providers>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
