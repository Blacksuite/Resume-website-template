import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from './languageContext';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'John Doe - Resume',
  description: 'Professional resume of John Doe, Example Expertise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}