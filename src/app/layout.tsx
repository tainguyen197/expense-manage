import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { Toaster } from "@/components/ui/toaster";
import { TransactionCacheProvider } from "@/contexts/TransactionCacheContext";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const nunito = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "AI Chat - Intelligent Conversations",
  description:
    "Transform your communication with intelligent, context-aware chat experiences",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "AI Chat",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          crossOrigin="use-credentials"
          rel="manifest"
          href="/manifest.json"
        />
        <link rel="apple-touch-icon" href="/icons/icon-128x128.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${nunito.className} bg-background antialiased dark`}>
        <ClerkProvider>
          <TransactionCacheProvider>
            <ServiceWorkerRegistration />
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
          </TransactionCacheProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
