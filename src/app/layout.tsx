import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "./components/NotificationContext";
import { UserProvider } from "../features/user/presentation/context/UserContext";
import { WalletProvider } from "../features/wallet";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={spaceGrotesk.className}
      >
        <NotificationProvider>
          <UserProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </UserProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
