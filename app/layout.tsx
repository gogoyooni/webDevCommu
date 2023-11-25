import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "./_components/SessionProvider";
import Providers from "./_components/QueryClientProvider";
import Nav from "./_components/Nav";

import { Toaster } from "@/components/ui/toaster";
import SideNavigation from "./_components/SideNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevCommunity",
  description: "A community website for finding team mates for projects",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <Nav />
            <div className="flex h-full">
              <SideNavigation />
              {children}
            </div>
            <Toaster />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
