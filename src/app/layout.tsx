import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "../features/notifications/context/NotificationContext";
import { ToastContainer } from "../features/notifications/components/ToastContainer";
import { UserProvider } from "../features/user/presentation/context/UserContext";
import { WalletProvider } from "../features/wallet";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "iKash",
  description: "We bridge the gap between traditional finance and Stellar's liquidity to drive sustainable, real-world adoption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        {/* Global notification provider – mount once at the root */}
        <NotificationProvider>
          {/* Global toast renderer – exists once in the entire application */}
          <ToastContainer />
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
