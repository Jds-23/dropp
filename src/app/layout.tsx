"use client";
import "./globals.css";
// import { Inter } from 'next/font/google'
import localFont from "next/font/local";
import Header from "@/components/header";
import AppProvider from "@/state/app/context";

// Font files can be colocated inside of `pages`
const drukWideBold = localFont({
  src: "./fonts/FontsFree-Net-Druk-Wide-Bold.ttf",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={drukWideBold.className}>
        <div className="root-div">
          <AppProvider>
            <Header />
            {children}
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
