import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { config } from "dotenv";
import { Toaster } from "@/components/ui/toaster";
config();

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${nunito.className} bg-background antialiased pink`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
