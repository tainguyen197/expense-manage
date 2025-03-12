"use client";

import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block">{<Header />}</div>
      <main className="min-h-screen md:pt-16">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
