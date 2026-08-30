import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/features/notifications";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { UserProvider } from "../features/user/presentation/context/UserContext";
import { WalletProvider, WrongNetworkBanner } from "../features/wallet";
import { Space_Grotesk } from "next/font/google";
import { QueryProvider } from "./providers/QueryProvider";

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
        <QueryProvider>
          <NotificationProvider>
            <UserProvider>
              <WalletProvider>
                <WrongNetworkBanner />
                {children}
                <CookieConsentBanner />
              </WalletProvider>
            </UserProvider>
          </NotificationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
