import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "../features/wallet";
import { EscrowProvider } from "../features/escrow";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "iKash",
  description: "We bridge the gap between traditional finance and Stellar’s liquidity to drive sustainable, real-world adoption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={spaceGrotesk.className}
      >
        <WalletProvider>
          <EscrowProvider>
            {children}
          </EscrowProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
