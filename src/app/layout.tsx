import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { Toaster } from "@/components/ui/toaster";
import { TransactionCacheProvider } from "@/contexts/TransactionCacheContext";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat - Intelligent Conversations",
  description:
    "Transform your communication with intelligent, context-aware chat experiences",
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
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
          </TransactionCacheProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
