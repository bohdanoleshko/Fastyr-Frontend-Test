import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "../components/SideBar";
import { Header } from "../components/ui/Header";
import React from "react";
import ApolloProviderWrapper from "@/components/ApolloProviderWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fastyr Frontend Test",
  description: "Senior Frontend Developer Test Project for Fastyr",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
      <ApolloProviderWrapper>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 w-full flex flex-col">
                <Header />
                <div className="flex-1 p-8">{children}</div>
              </main>
            </div>
          </ApolloProviderWrapper>

      </body>
    </html>
  );
}