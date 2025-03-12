import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TransactionCacheProvider } from "@/contexts/TransactionCacheContext";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Money Manager",
  description: "Track your expenses and income",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} bg-background antialiased dark`}>
        <ClerkProvider>
          <TransactionCacheProvider>
            {children}
            <Toaster />
          </TransactionCacheProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
